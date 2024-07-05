import dbConnect from '@/lib/dbconnect';
import ProfileIcon from '@/models/ProfileIcon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url!);
  const userId = searchParams.get('userId');
  const results = await ProfileIcon.find({
    uploadedBy: userId,
  });
  return NextResponse.json(
    {
      message: results,
    },
    { status: 200 }
  );
}
