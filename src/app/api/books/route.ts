import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Book } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const books = await Book.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const book = new Book({
      title: body.title,
      author: body.author,
      genre: body.genre,
      isbn: body.isbn,
      description: body.description,
      coverUrl: body.coverUrl,
      tags: body.tags,
      status: 'available'
    });

    const savedBook = await book.save();
    return NextResponse.json({ success: true, data: savedBook }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
