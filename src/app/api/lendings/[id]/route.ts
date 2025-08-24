import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lending, Book } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lending ID' },
        { status: 400 }
      );
    }

    const lending = await Lending.findById(params.id)
      .populate('bookId', 'title author')
      .populate('friendId', 'name email');
    
    if (!lending) {
      return NextResponse.json(
        { success: false, error: 'Lending record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lending });
  } catch (error) {
    console.error('Error fetching lending record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lending record' },
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
        { success: false, error: 'Invalid lending ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const lending = await Lending.findByIdAndUpdate(
      params.id,
      {
        expectedReturnDate: body.expectedReturnDate ? new Date(body.expectedReturnDate) : undefined,
        actualReturnDate: body.actualReturnDate ? new Date(body.actualReturnDate) : undefined,
        status: body.status,
        returnCondition: body.returnCondition,
        notes: body.notes
      },
      { new: true, runValidators: true }
    );

    if (!lending) {
      return NextResponse.json(
        { success: false, error: 'Lending record not found' },
        { status: 404 }
      );
    }

    // If the book is being returned, update the book status
    if (body.status === 'returned') {
      await Book.findByIdAndUpdate(lending.bookId, {
        status: 'available',
        lentTo: undefined,
        lentDate: undefined
      });
    }

    // Populate the updated lending record
    const populatedLending = await Lending.findById(lending._id)
      .populate('bookId', 'title author')
      .populate('friendId', 'name email');

    return NextResponse.json({ success: true, data: populatedLending });
  } catch (error) {
    console.error('Error updating lending record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lending record' },
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
        { success: false, error: 'Invalid lending ID' },
        { status: 400 }
      );
    }

    const lending = await Lending.findById(params.id);

    if (!lending) {
      return NextResponse.json(
        { success: false, error: 'Lending record not found' },
        { status: 404 }
      );
    }

    // Update book status back to available if it was lent
    await Book.findByIdAndUpdate(lending.bookId, {
      status: 'available',
      lentTo: undefined,
      lentDate: undefined
    });

    await Lending.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'Lending record deleted successfully' });
  } catch (error) {
    console.error('Error deleting lending record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lending record' },
      { status: 500 }
    );
  }
}
