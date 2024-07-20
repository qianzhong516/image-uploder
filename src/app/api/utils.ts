import { NextResponse } from 'next/server';

export const getErrorResponse = (
  message: string,
  statusCode: number
) => {
  return NextResponse.json(
    {
      message,
    },
    { status: statusCode }
  );
};
