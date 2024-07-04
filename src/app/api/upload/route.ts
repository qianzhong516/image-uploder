import { NextResponse, NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import z, { ZodError } from 'zod';

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

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const writePath = path.resolve(
      process.cwd(),
      `public/uploads/${Date.now()}_${file.name}`
    );
    await writeFile(writePath, buffer);

    return NextResponse.json(
      { message: 'File uploaded' },
      { status: 200 }
    );
  } catch (_) {
    return NextResponse.json(
      {
        message:
          'An unexpected error occurred during the upload. Please contact support if the issue persists.',
      },
      { status: 500 }
    );
  }
}
