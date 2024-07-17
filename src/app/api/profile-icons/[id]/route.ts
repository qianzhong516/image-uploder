import { unlink, readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import sharp from 'sharp';
import { promisify } from 'util';

// profile-icons/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;
  const data = await req.json();
  const { uploadedBy: userId, cropData, cropRatio } = data;

  Object.keys(cropData).forEach((key) => {
    const value = cropData[key];
    if (typeof value === 'number') {
      cropData[key] = Math.round(cropRatio * value);
    }
  });

  const inputPath = path.resolve(
    process.cwd(),
    `public/uploads/${userId}/${fileId}`
  );

  const newTitle = `${Date.now()}-${fileId}`;
  const outputPath = path.resolve(
    process.cwd(),
    `public/uploads/${userId}/${newTitle}`
  );

  try {
    const input = await readFile(inputPath);
    const instance = sharp(input).extract(cropData);
    const toFile = promisify(instance.toFile.bind(instance));
    await toFile(outputPath);

    // delete the old file
    await unlink(inputPath);

    const result = await ProfileIcon.findOneAndUpdate(
      {
        title: fileId,
        uploadedBy: userId,
      },
      {
        title: newTitle,
        path: `/uploads/${userId}/${newTitle}`,
      },
      {
        new: true,
      }
    );

    return NextResponse.json(
      {
        message: result,
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

// profile-icons/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;
  const data = await req.json();
  const { uploadedBy: userId } = data;

  try {
    await unlink(
      path.resolve(
        process.cwd(),
        `public/uploads/${userId}/${fileId}`
      )
    );
    await ProfileIcon.deleteOne({
      title: fileId,
    });

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
