import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import z, { ZodError } from 'zod';
import ProfileIcon from '@/models/ProfileIcon';
import dbConnect from '@/lib/dbconnect';
import client from '../client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v1 as uuid } from 'uuid';
import { getErrorResponse } from '../utils';

// TODO: remove this later
const USER_ID = '66882ac39085ad43fb32ce05';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as unknown as File;

  if (!file) {
    return getErrorResponse('File missing', 500);
  }

  const sizeLimit = z.number().max(1024 * 1024 * 5, {
    message:
      'This image is larger than 5MB. Please select a smaller image.',
  });
  const formatLimit = z.string().regex(/\.(png|jpeg|jpg)$/i, {
    message: `The file format of ${file.name} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
  });

  try {
    sizeLimit.parse(file.size);
    formatLimit.parse(file.name);
  } catch (err) {
    if (err instanceof ZodError) {
      return getErrorResponse(err.issues[0].message, 400);
    }
  }

  await dbConnect();

  try {
    const ext = path.extname(file.name);
    const key = `${USER_ID}/${uuid()}${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
    });
    await client.send(command);

    const icon = await ProfileIcon.create({
      title: file.name,
      totalSizeInBytes: file.size,
      path: key,
      uploadedBy: USER_ID,
    });

    return NextResponse.json(
      {
        message: {
          id: icon._id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return getErrorResponse(
      'An unexpected error occurred during the upload. Please contact support if the issue persists.',
      500
    );
  }
}
