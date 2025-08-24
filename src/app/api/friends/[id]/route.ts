import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Friend } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid friend ID' },
        { status: 400 }
      );
    }

    const friend = await Friend.findById(params.id);
    
    if (!friend) {
      return NextResponse.json(
        { success: false, error: 'Friend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: friend });
  } catch (error) {
    console.error('Error fetching friend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch friend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid friend ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const friend = await Friend.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        email: body.email,
        phone: body.phone
      },
      { new: true, runValidators: true }
    );

    if (!friend) {
      return NextResponse.json(
        { success: false, error: 'Friend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: friend });
  } catch (error) {
    console.error('Error updating friend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update friend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid friend ID' },
        { status: 400 }
      );
    }

    const friend = await Friend.findByIdAndDelete(params.id);

    if (!friend) {
      return NextResponse.json(
        { success: false, error: 'Friend not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete friend' },
      { status: 500 }
    );
  }
}
