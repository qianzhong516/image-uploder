import dbConnect from '@/lib/dbconnect';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import UserProfile from '@/models/UserProfile';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: userId } = params;

  try {
    await dbConnect();

    const userProfile = await UserProfile.findOne({
      _id: userId,
    });

    return NextResponse.json(
      {
        message: userProfile,
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

    const userProfile = await UserProfile.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        profileIcon: icon.path,
      },
      {
        new: true, // return the updated result
      }
    );

    return NextResponse.json(
      {
        message: userProfile,
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
