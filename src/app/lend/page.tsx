"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Book, User, Calendar, Check } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { apiGet, apiPost, apiPut } from '@/lib/api';

interface Book {
  _id: string;
  title: string;
  author: string;
  status: 'available' | 'lent';
}

interface Friend {
  _id: string;
  name: string;
  email?: string;
}

interface Lending {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
  friendId: {
    _id: string;
    name: string;
    email?: string;
  };
  lentDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  notes?: string;
  status: 'active' | 'returned';
}

interface LendingFormData {
  bookId: string;
  friendId: string;
  expectedReturnDate?: string;
  notes?: string;
}

function LendingForm({ onSubmit, onCancel, books, friends }: { 
  onSubmit: (data: LendingFormData) => void,
  onCancel: () => void,
  books: Book[],
  friends: Friend[]
}) {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');

  const availableBooks = books.filter(book => book.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedFriend) return;
    
    onSubmit({
      bookId: selectedBook,
      friendId: selectedFriend,
      expectedReturnDate: expectedReturnDate || undefined,
      notes: notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Book *</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Choose a book to lend</option>
            {availableBooks.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
          {availableBooks.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">No books available for lending</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Friend *</label>
          <select
            value={selectedFriend}
            onChange={(e) => setSelectedFriend(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Choose a friend</option>
            {friends.map((friend) => (
              <option key={friend._id} value={friend._id}>
                {friend.name} {friend.email && `(${friend.email})`}
              </option>
            ))}
          </select>
          {friends.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">No friends added yet</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Expected Return Date</label>
        <Input
          type="date"
          value={expectedReturnDate}
          onChange={(e) => setExpectedReturnDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[80px] resize-none"
          placeholder="Any additional notes about this lending"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={!selectedBook || !selectedFriend || availableBooks.length === 0 || friends.length === 0}
        >
          Lend Book
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function LendingList({ lendings, onReturn }: {
  lendings: Lending[];
  onReturn: (id: string) => void;
}) {
  const isOverdue = (expectedDate?: string) => {
    if (!expectedDate) return false;
    return new Date(expectedDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {lendings.map((lending) => (
        <Card key={lending._id} className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg flex items-center justify-center">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{lending.bookId?.title || 'Unknown Book'}</h3>
                    <p className="text-gray-600 dark:text-gray-400">by {lending.bookId?.author || 'Unknown Author'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Lent to {lending.friendId?.name || 'Unknown Friend'}</span>
                      {lending.friendId?.email && (
                        <span className="text-sm text-gray-500">({lending.friendId.email})</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={lending.status === 'active' ? 'default' : 'secondary'}>
                    {lending.status === 'active' ? 'Currently Lent' : 'Returned'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Lent: {new Date(lending.lentDate).toLocaleDateString()}</span>
                  </div>
                  {lending.expectedReturnDate && (
                    <div className={`flex items-center gap-1 text-sm ${
                      isOverdue(lending.expectedReturnDate) && lending.status === 'active'
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      <span>
                        Expected: {new Date(lending.expectedReturnDate).toLocaleDateString()}
                        {isOverdue(lending.expectedReturnDate) && lending.status === 'active' && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                  {lending.actualReturnDate && (
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span>Returned: {new Date(lending.actualReturnDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                {lending.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    💭 {lending.notes}
                  </p>
                )}
              </div>
              {lending.status === 'active' && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onReturn(lending._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Returned
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function LendPage() {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLendForm, setShowLendForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { updateLendingCount } = useSidebar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lendingsRes, booksRes, friendsRes] = await Promise.all([
        apiGet('/api/lendings'),
        apiGet('/api/books'),
        apiGet('/api/friends')
      ]);

      const [lendingsData, booksData, friendsData] = await Promise.all([
        lendingsRes.json(),
        booksRes.json(),
        friendsRes.json()
      ]);

      if (lendingsData.success) setLendings(lendingsData.data);
      if (booksData.success) setBooks(booksData.data);
      if (friendsData.success) setFriends(friendsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLendings = lendings.filter(lending => {
    // Skip lending records with missing book or friend data
    if (!lending.bookId || !lending.friendId) {
      return false;
    }
    
    const matchesSearch = 
      lending.bookId.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lending.bookId.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lending.friendId.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || lending.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleLendBook = async (lendingData: LendingFormData) => {
    try {
      const response = await apiPost('/api/lendings', lendingData);

      const data = await response.json();
      if (data.success) {
        // Refresh data to get updated book status and lending records
        await fetchData();
        setShowLendForm(false);
        updateLendingCount(1); // Increment active lending count
      } else {
        console.error('Failed to lend book:', data.error);
        alert('Failed to lend book. Please try again.');
      }
    } catch (error) {
      console.error('Error lending book:', error);
      alert('Failed to lend book. Please try again.');
    }
  };

  const handleReturnBook = async (lendingId: string) => {
    if (!confirm('Mark this book as returned?')) return;

    try {
      const response = await apiPut(`/api/lendings/${lendingId}`, { 
        status: 'returned',
        actualReturnDate: new Date().toISOString()
      });

      const data = await response.json();
      if (data.success) {
        // Refresh data to get updated status
        await fetchData();
        updateLendingCount(-1); // Decrement active lending count
      } else {
        console.error('Failed to return book:', data.error);
        alert('Failed to return book. Please try again.');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book. Please try again.');
    }
  };

  const stats = {
    total: lendings.length,
    active: lendings.filter(l => l.status === 'active').length,
    returned: lendings.filter(l => l.status === 'returned').length,
    overdue: lendings.filter(l => 
      l.status === 'active' && 
      l.expectedReturnDate && 
      new Date(l.expectedReturnDate) < new Date()
    ).length,
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Lend Books</h1>
        <Button onClick={() => setShowLendForm(!showLendForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Lend a Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Lendings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Currently Lent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Returned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Lend Form */}
      {showLendForm && (
        <Card>
          <CardHeader>
            <CardTitle>Lend a Book</CardTitle>
          </CardHeader>
          <CardContent>
            <LendingForm 
              onSubmit={handleLendBook}
              onCancel={() => setShowLendForm(false)}
              books={books}
              friends={friends}
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by book title, author, or friend name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="active">Currently Lent</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lendings List */}
      {filteredLendings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'No lending records found matching your criteria.' 
                : 'No books have been lent yet. Start lending books to friends!'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <LendingList
          lendings={filteredLendings}
          onReturn={handleReturnBook}
        />
      )}
    </div>
  );
}
