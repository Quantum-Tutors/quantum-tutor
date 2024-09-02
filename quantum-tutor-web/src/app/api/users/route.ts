import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userInfo = await req.json();
    const user = await User.create(userInfo);
    return NextResponse.json(
      {
        message: 'User Created successfully',
        data: { user },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'User creation failed', data: { error } },
      { status: 500 }
    );
  }
}
