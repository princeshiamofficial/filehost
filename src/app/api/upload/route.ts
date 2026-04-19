import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        /**
         * Generate a token for the client to upload a file.
         * In a real app, you would check if the user is logged in here.
         */
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4', 'text/plain'],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // userId: user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called on your server after a file is uploaded
        console.log('Upload completed:', blob, tokenPayload);

        try {
          // You could update your database here
          // await db.update(blob.url, ...)
        } catch (error) {
          throw new Error('Could not update database');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The client will receive this error
    );
  }
}
