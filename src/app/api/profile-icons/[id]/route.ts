import { unlink, readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import sharp from 'sharp';
import { promisify } from 'util';
import UserProfile from '@/models/UserProfile';

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

  const ext = path.extname(fileId);
  const fileName = path.parse(fileId).name;
  const match = fileName.match(/(.+)-cropped-(\d)$/);
  console.log({ match });
  // fileName, fileName-cropped-1, fileName-cropped-2, ...
  let newTitle = '';
  if (!match) {
    newTitle = `${fileName}-cropped-1${ext}`;
  } else {
    const versionNum = Number(match[2]) + 1;
    newTitle = `${match[1]}-cropped-${versionNum}${ext}`;
  }

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

    // if the image is what user's primary icon, update the saved path in DB
    let isPrimaryIcon = false;
    const icon = await UserProfile.findOne({
      _id: userId,
    });
    if (icon) {
      isPrimaryIcon =
        icon.profileIcon === `/uploads/${userId}/${fileId}`;
    }
    if (isPrimaryIcon) {
      await UserProfile.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          profileIcon: `/uploads/${userId}/${newTitle}`,
        }
      );
    }

    const result = await ProfileIcon.findOneAndUpdate(
      {
        title: fileId,
        uploadedBy: userId,
      },
      {
        title: newTitle,
        path: `/uploads/${userId}/${newTitle}`,
        totalSize: 0, // TODO:,
      },
      {
        new: true,
      }
    );

    return NextResponse.json(
      {
        message: {
          profileIcon: result,
          isPrimaryIconUpdated: isPrimaryIcon,
        },
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
