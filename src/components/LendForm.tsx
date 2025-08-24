"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface Book {
  _id: string;
  title: string;
  author: string;
}

interface Friend {
  _id: string;
  name: string;
  email?: string;
}

interface LendFormData {
  bookId: string;
  friendId: string;
  lendDate: string;
  expectedReturnDate?: string;
  condition: string;
  notes?: string;
}

interface LendFormProps {
  onSubmit: (data: LendFormData) => void;
  friends: Friend[];
  books: Book[];
  initialData?: Partial<LendFormData>;
}

export default function LendForm({ onSubmit, friends = [], books = [], initialData = {} }: LendFormProps) {
  const [bookId, setBookId] = useState(initialData.bookId || '');
  const [friendId, setFriendId] = useState(initialData.friendId || '');
  const [lendDate, setLendDate] = useState(initialData.lendDate || new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState(initialData.expectedReturnDate || '');
  const [condition, setCondition] = useState(initialData.condition || 'Good');
  const [notes, setNotes] = useState(initialData.notes || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ 
      bookId, 
      friendId, 
      lendDate, 
      expectedReturnDate: expectedReturnDate || undefined, 
      condition,
      notes: notes || undefined
    });
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
            <ArrowsRightLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          New Lending Record
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="book" className="text-sm font-medium">Book *</Label>
              <select 
                id="book"
                value={bookId} 
                onChange={e => setBookId(e.target.value)} 
                required 
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-md transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-background"
              >
                <option value="">Select a book</option>
                {books.map(book => (
                  <option key={book._id} value={book._id}>
                    {book.title} by {book.author}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="friend" className="text-sm font-medium">Friend *</Label>
              <select 
                id="friend"
                value={friendId} 
                onChange={e => setFriendId(e.target.value)} 
                required 
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-md transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-background"
              >
                <option value="">Select a friend</option>
                {friends.map(friend => (
                  <option key={friend._id} value={friend._id}>
                    {friend.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="lendDate" className="text-sm font-medium">Lend Date *</Label>
              <Input
                id="lendDate"
                type="date"
                value={lendDate}
                onChange={e => setLendDate(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedReturn" className="text-sm font-medium">Expected Return Date</Label>
              <Input
                id="expectedReturn"
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-medium">Book Condition *</Label>
            <select 
              id="condition"
              value={condition} 
              onChange={e => setCondition(e.target.value)} 
              required 
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-md transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-background"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-md transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-background min-h-[80px] resize-none"
              placeholder="Any additional notes about this lending..."
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Create Lending Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
