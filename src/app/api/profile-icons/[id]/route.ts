import { unlink, readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import sharp from 'sharp';
import { promisify } from 'util';
import UserProfile from '@/models/UserProfile';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import client from '../../client';
import { getErrorResponse } from '../../utils';
import { v1 as uuid } from 'uuid';

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

  // find the saved path from db
  const oldIcon = await ProfileIcon.findById(fileId);
  if (!oldIcon) {
    return getErrorResponse('Icon is not found.', 400);
  }

  try {
    // download the old file
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: oldIcon.path,
    });
    const response = await client.send(command);
    const bytes = await response.Body?.transformToByteArray();

    // crop the file
    const instance = sharp(bytes).extract(cropData);
    const buffer = await instance.toBuffer();

    // upload the cropped version
    const ext = path.extname(oldIcon.title);
    const key = `${userId}/${uuid()}${ext}`;
    const uploadCmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
    });
    await client.send(uploadCmd);

    // update DB record
    await ProfileIcon.findByIdAndUpdate(fileId, {
      path: key,
    });

    // delete the old file
    const deleteCmd = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: oldIcon.path,
    });
    await client.send(deleteCmd);

    return NextResponse.json(
      {
        message: {
          profileIcon: {
            totalSize: buffer.byteLength,
            path: key,
          },
        },
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return getErrorResponse(err.message, 400);
    }
  }
}

// profile-icons/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  try {
    const icon = await ProfileIcon.findById(fileId);

    if (!icon) {
      throw new Error('File does not exist.');
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: icon.path,
    });
    await client.send(command);
    await ProfileIcon.deleteOne({
      _id: fileId,
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
