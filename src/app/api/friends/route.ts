import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Friend } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const friends = await Friend.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const friend = new Friend({
      name: body.name,
      email: body.email,
      phone: body.phone
    });

    const savedFriend = await friend.save();
    return NextResponse.json({ success: true, data: savedFriend }, { status: 201 });
  } catch (error) {
    console.error('Error creating friend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create friend' },
      { status: 500 }
    );
  }
}
