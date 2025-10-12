"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import connectDB from '@/lib/db';
import Pact from '@/models/Pact';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const SubmissionSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB.")
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Invalid file type. Only JPG, PNG, and PDF are allowed."),
  pactId: z.string(),
});

export async function submitPactWorkAction(formData: FormData) {
  const { userId: developerId } = await auth();
  if (!developerId) {
    return { success: false, error: "Authentication failed." };
  }

  const validated = SubmissionSchema.safeParse({
    file: formData.get("file"),
    pactId: formData.get("pactId"),
  });

  if (!validated.success) {
    const errorMessages = validated.error.errors.map(err => err.message).join(", ");
    return { success: false, error: errorMessages };
  }

  const { file, pactId } = validated.data;

  const uniqueFileName = `${pactId}-${Date.now()}-${file.name}`;
  const uploadDir = join(process.cwd(), 'uploads');
  const submissionPath = join(uploadDir, uniqueFileName);

  try {
    await connectDB();
    const pact = await Pact.findOne({ _id: pactId, partnerId: developerId });
    if (!pact) {
        return { success: false, error: "Pact not found or you are not the partner." };
    }
    
    await mkdir(uploadDir, { recursive: true });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(submissionPath, fileBuffer);

    pact.submission = {
      filePath: submissionPath,
      fileName: file.name,
      submittedAt: new Date(),
    };
    await pact.save();

    revalidatePath("/dashboard/pacts");
    return { success: true, message: "File uploaded successfully." };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, error: "Failed to upload file. Please try again." };
  }
}