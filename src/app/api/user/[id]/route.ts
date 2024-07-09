import dbConnect from '@/lib/dbconnect';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import UserProfile from '@/models/UserProfile';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: userId } = params;
  const { data } = await req.json();

  try {
    await dbConnect();

    const icon = await ProfileIcon.findOne({
      title: data.profileIconTitle,
    });

    if (!icon) {
      return NextResponse.json(
        {
          message: 'File does not exist.',
        },
        { status: 400 }
      );
    }

    await UserProfile.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        profileIcon: icon.path,
      }
    );

    return NextResponse.json(
      {
        message: 'Icon has been updated.',
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
