import { NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs'; // CORRECTED: Import from the standard 'fs' module
import { join } from 'path';
import mime from 'mime-types';
import connectDB from '@/lib/db';
import Pact from '@/models/Pact';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function GET(
    request: Request,
    { params }: { params: { pactId: string } }
) {
    const { userId } =await auth();
    if (!userId) {
        return new NextResponse('Authentication failed.', { status: 401 });
    }

    try {
        await connectDB();
        const pact = await Pact.findById(params.pactId);

        if (!pact) {
            return new NextResponse('Pact not found.', { status: 404 });
        }

        if (pact.creatorId !== userId) {
            return new NextResponse('You are not authorized to view this submission.', { status: 403 });
        }

        if (pact.submission.viewedBy) {
            return new NextResponse('This submission has already been viewed.', { status: 400 });
        }

        const filePath = pact.submission.filePath;
        if (!filePath) {
            return new NextResponse('No file has been submitted for this pact.', { status: 404 });
        }

        const fileStats = await stat(filePath).catch(() => null);
        if (!fileStats) {
            return new NextResponse('File not found on server.', { status: 404 });
        }

        pact.submission.viewedBy = userId;
        await pact.save();

        revalidatePath("/dashboard/pacts");

        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        const fileStream = createReadStream(filePath);
        
        const readableStream = new ReadableStream({
          start(controller) {
            fileStream.on('data', (chunk) => {
              controller.enqueue(chunk);
            });
            fileStream.on('end', () => {
              controller.close();
            });
            fileStream.on('error', (err) => {
              controller.error(err);
            });
          },
        });
        
        return new NextResponse(readableStream, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${pact.submission.fileName}"`,
                'Content-Length': fileStats.size.toString(),
            },
        });

    } catch (error) {
        console.error('File download error:', error);
        return new NextResponse('Failed to download file.', { status: 500 });
    }
}