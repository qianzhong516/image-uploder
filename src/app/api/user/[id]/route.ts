import dbConnect from '@/lib/dbconnect';
import { NextRequest, NextResponse } from 'next/server';
import ProfileIcon from '@/models/ProfileIcon';
import UserProfile from '@/models/UserProfile';
import { getErrorResponse } from '../../utils';

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
    return getErrorResponse('Icon is not specified.', 400);
  }

  try {
    await dbConnect();

    const icon = await ProfileIcon.findById(iconId);

    if (!icon) {
      return getErrorResponse('File does not exist.', 400);
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
      return getErrorResponse(err.message, 400);
    }
  }
}
