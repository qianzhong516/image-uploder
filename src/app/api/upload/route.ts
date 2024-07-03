import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as unknown as File;

  if (!file) {
    return Response.json({
      status: 'file missing',
      init: { status: 500 },
    });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const writePath = path.resolve(
    process.cwd(),
    `public/uploads/${Date.now()}_${file.name}`
  );
  await writeFile(writePath, buffer);

  return Response.json({
    status: 'file uploaded',
    init: { status: 200 },
  });
}
