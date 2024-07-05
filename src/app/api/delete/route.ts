import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
  const res = await req.json();
  try {
    await unlink(
      path.resolve(process.cwd(), `public/uploads/${res.id}`)
    );
    return NextResponse.json(
      {
        message: 'Image has been deleted.',
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          message: err.message,
        },
        { status: 400 }
      );
    }
  }
}
