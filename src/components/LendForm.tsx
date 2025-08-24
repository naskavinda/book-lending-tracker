"use client";
import { useState } from 'react';

export default function LendForm({ onSubmit, friends = [], books = [], initialData = {} }: { onSubmit: (data: any) => void, friends: any[], books: any[], initialData?: any }) {
  const [bookId, setBookId] = useState(initialData.bookId || '');
  const [friendId, setFriendId] = useState(initialData.friendId || '');
  const [lendDate, setLendDate] = useState(initialData.lendDate || '');
  const [expectedReturn, setExpectedReturn] = useState(initialData.expectedReturn || '');
  const [condition, setCondition] = useState(initialData.condition || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ bookId, friendId, lendDate, expectedReturn, condition });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Book</label>
        <select value={bookId} onChange={e => setBookId(e.target.value)} required className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Book</option>
          {books.map(book => (
            <option key={book._id} value={book._id}>{book.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Friend</label>
        <select value={friendId} onChange={e => setFriendId(e.target.value)} required className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Friend</option>
          {friends.map(friend => (
            <option key={friend._id} value={friend._id}>{friend.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Lend Date</label>
        <input type="date" value={lendDate} onChange={e => setLendDate(e.target.value)} required className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Expected Return</label>
        <input type="date" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Condition Notes</label>
        <input type="text" value={condition} onChange={e => setCondition(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Lend Book</button>
    </form>
  );
}
