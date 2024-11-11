import { NextResponse } from 'next/server';
import { saveModule } from '@/utils/storage';

export async function POST(request: Request) {
  try {
    const moduleData = await request.json();
    const savedData = saveModule(moduleData);
    return NextResponse.json(savedData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save module' },
      { status: 500 }
    );
  }
}