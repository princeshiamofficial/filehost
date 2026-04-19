import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { blobs } = await list();
    return NextResponse.json(blobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
