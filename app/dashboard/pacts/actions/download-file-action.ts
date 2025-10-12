"use server";

import { auth } from '@clerk/nextjs/server';
import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import mime from 'mime-types';
import connectDB from '@/lib/db';
import Pact from '@/models/Pact';
import { revalidatePath } from 'next/cache'; // NEW IMPORT

export async function downloadSubmittedWork(pactId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: 'Authentication failed.' };
    }

    try {
        await connectDB();
        const pact = await Pact.findById(pactId);

        if (!pact) {
            return { success: false, error: 'Pact not found.' };
        }

        if (pact.creatorId !== userId) {
            return { success: false, error: 'You are not authorized to view this submission.' };
        }

        if (pact.submission.viewedBy) {
            return { success: false, error: 'This submission has already been viewed.' };
        }
        
        const filePath = pact.submission.filePath;
        if (!filePath) {
            return { success: false, error: 'No file has been submitted for this pact.' };
        }

        pact.submission.viewedBy = userId;
        await pact.save();

        // --- NEW LINE: Revalidate the path to force a UI update ---
        revalidatePath("/dashboard/pacts");

        const fileExists = await stat(filePath).catch(() => false);
        if (!fileExists) {
            return { success: false, error: 'File not found on server.' };
        }

        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        const fileStream = createReadStream(filePath);
        
        return { 
            success: true, 
            fileStream, 
            fileName: pact.submission.fileName, 
            mimeType
        };

    } catch (error) {
        console.error('File download error:', error);
        return { success: false, error: 'Failed to download file.' };
    }
}