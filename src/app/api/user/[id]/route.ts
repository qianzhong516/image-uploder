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

    const icon = await ProfileIcon.findById(userProfile.profileIcon);

    return NextResponse.json(
      {
        message: { icon },
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
  const { iconId } = await req.json();

  if (!iconId) {
    return NextResponse.json(
      {
        message: 'Icon is not specified.',
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const icon = await ProfileIcon.findById(iconId);

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
        profileIcon: iconId,
      },
      {
        new: true, // return the updated result
      }
    );

    return NextResponse.json(
      {
        message: { icon },
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
