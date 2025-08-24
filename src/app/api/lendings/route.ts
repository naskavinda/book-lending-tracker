import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lending, Book } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const lendings = await Lending.find({})
      .populate('bookId', 'title author')
      .populate('friendId', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: lendings });
  } catch (error) {
    console.error('Error fetching lendings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lending records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const currentDate = new Date();
    
    // Update book status to lent
    await Book.findByIdAndUpdate(body.bookId, {
      status: 'lent',
      lentTo: body.friendId,
      lentDate: currentDate
    });

    const lending = new Lending({
      bookId: body.bookId,
      friendId: body.friendId,
      lendDate: currentDate,
      expectedReturnDate: body.expectedReturnDate ? new Date(body.expectedReturnDate) : undefined,
      condition: body.condition || 'good', // Default condition
      notes: body.notes,
      status: 'active'
    });

    const savedLending = await lending.save();
    
    // Populate the saved lending record
    const populatedLending = await Lending.findById(savedLending._id)
      .populate('bookId', 'title author')
      .populate('friendId', 'name email');

    return NextResponse.json({ success: true, data: populatedLending }, { status: 201 });
  } catch (error) {
    console.error('Error creating lending record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lending record' },
      { status: 500 }
    );
  }
}
