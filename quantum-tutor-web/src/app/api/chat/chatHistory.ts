import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const res = await fetch('http://127.0.0.1:8000/', {
      method: 'POST',
      body: JSON.stringify(req.json()),
    });

    return NextResponse.json(
      {
        message: 'Chat data',
        data: { res },
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
