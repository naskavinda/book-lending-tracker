import mongoose, { Schema, Document } from 'mongoose';

// Book Model
export interface IBook extends Document {
  title: string;
  author: string;
  genre?: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  tags?: string;
  status: 'available' | 'lent';
  lentTo?: string;
  lentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  isbn: { type: String },
  description: { type: String },
  coverUrl: { type: String },
  tags: { type: String },
  status: { type: String, enum: ['available', 'lent'], default: 'available' },
  lentTo: { type: String },
  lentDate: { type: Date },
}, {
  timestamps: true
});

// Friend Model
export interface IFriend extends Document {
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FriendSchema = new Schema<IFriend>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
}, {
  timestamps: true
});

// Lending Model
export interface ILending extends Document {
  bookId: mongoose.Types.ObjectId;
  friendId: mongoose.Types.ObjectId;
  lendDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  condition?: string;
  returnCondition?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LendingSchema = new Schema<ILending>({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  friendId: { type: Schema.Types.ObjectId, ref: 'Friend', required: true },
  lendDate: { type: Date, required: true },
  expectedReturnDate: { type: Date },
  actualReturnDate: { type: Date },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  condition: { type: String, default: 'good' },
  returnCondition: { type: String },
  notes: { type: String },
}, {
  timestamps: true
});

// Export models (avoid re-compilation during development)
export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export const Friend = mongoose.models.Friend || mongoose.model<IFriend>('Friend', FriendSchema);
export const Lending = mongoose.models.Lending || mongoose.model<ILending>('Lending', LendingSchema);
