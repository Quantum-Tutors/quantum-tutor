import connectDB from '@/lib/db';
import Module from '@/lib/models/Module';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get a specific query parameter
    const moduleId = searchParams.get('moduleId');

    await connectDB();

    const module = await Module.find({ moduleId: moduleId }, { _id: 0 });

    return NextResponse.json(module);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}
