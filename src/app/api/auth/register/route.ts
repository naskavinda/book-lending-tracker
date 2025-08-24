import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  await connectToDatabase();
  const existing = await User.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  return NextResponse.json({ message: 'User registered', user: { username: user.username } });
}
