import { NextResponse, NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import z, { ZodError } from 'zod';
import ProfileIcon from '@/models/ProfileIcon';
import dbConnect from '@/lib/dbconnect';
import client from '../client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v1 as uuid } from 'uuid';

// TODO: remove this later
const USER_ID = '66882ac39085ad43fb32ce05';

export async function GET(req: NextRequest) {
  if (!process.env.S3_BUCKET) {
    return NextResponse.json(
      { error: 'No bucket is specified.' },
      { status: 500 }
    );
  }

  const { searchParams: params } = new URL(req.url);
  const fileName = params.get('fileName');

  if (!fileName) {
    return NextResponse.json(
      { error: 'No fileName is specified.' },
      { status: 500 }
    );
  }

  const ext = path.extname(fileName);
  const formatLimit = z.string().regex(/\.(png|jpeg|jpg)$/i, {
    message: `The file format of ${ext} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
  });
  try {
    formatLimit.parse(ext);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: err.issues[0].message },
        { status: 400 }
      );
    }
  }

  try {
    const key = `${USER_ID}/${uuid()}${ext}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    return NextResponse.json({ message: url }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json(
      { error: 'File missing' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: err.issues[0].message },
        { status: 400 }
      );
    }
  }

  await dbConnect();

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dir = path.resolve(
      process.cwd(),
      `public/uploads/${USER_ID}/`
    );
    console.log(dir, 'if dir exists: ', existsSync(dir));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log('creating the directory');
    }

    await writeFile(path.resolve(dir, file.name), buffer);

    await ProfileIcon.create({
      title: file.name,
      totalSizeInBytes: file.size,
      path: `/uploads/${USER_ID}/${file.name}`,
      uploadedBy: USER_ID,
    });

    return NextResponse.json(
      { message: 'File uploaded' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          'An unexpected error occurred during the upload. Please contact support if the issue persists.',
      },
      { status: 500 }
    );
  }
}
