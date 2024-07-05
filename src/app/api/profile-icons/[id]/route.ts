import { unlink } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// TODO: delete the record from db
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;
  try {
    await unlink(
      path.resolve(process.cwd(), `public/uploads/${fileId}`)
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
