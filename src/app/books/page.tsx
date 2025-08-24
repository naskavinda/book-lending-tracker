"use client";
import { useState } from 'react';
import BookForm from '@/components/BookForm';
import BookList from '@/components/BookList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Sample data
const sampleBooks = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    isbn: '978-0-7432-7356-5',
    description: 'A classic American novel set in the Jazz Age.',
    coverUrl: '',
    tags: 'classic, american, literature',
    status: 'available' as const,
  },
  {
    _id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    isbn: '978-0-06-112008-4',
    description: 'A novel about racial injustice in the American South.',
    coverUrl: '',
    tags: 'classic, social justice',
    status: 'lent' as const,
    lentTo: 'Alice Johnson',
    lentDate: '2024-01-15',
  },
  {
    _id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    isbn: '978-0-441-17271-9',
    description: 'Epic science fiction novel set on the desert planet Arrakis.',
    coverUrl: '',
    tags: 'sci-fi, epic, space',
    status: 'available' as const,
  },
];

export default function BooksPage() {
  const [books, setBooks] = useState(sampleBooks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBook, setEditingBook] = useState(null);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddBook = (bookData: any) => {
    const newBook = {
      ...bookData,
      _id: Date.now().toString(),
      status: 'available' as const,
    };
    setBooks([...books, newBook]);
    setShowAddForm(false);
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setShowAddForm(true);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book._id !== id));
  };

  const handleLendBook = (book: any) => {
    alert(`Lend book: ${book.title}`);
  };

  const stats = {
    total: books.length,
    available: books.filter(b => b.status === 'available').length,
    lent: books.filter(b => b.status === 'lent').length,
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Books
        </h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.lent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lent Out</div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
          </CardHeader>
          <CardContent>
            <BookForm 
              onSubmit={handleAddBook} 
              initialData={editingBook || {}}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddForm(false);
                setEditingBook(null);
              }}
              className="mt-4"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="lent">Lent Out</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'No books found matching your criteria.' 
                : 'No books in your library yet. Add your first book!'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <BookList
          books={filteredBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onLend={handleLendBook}
        />
      )}
    </div>
  );
}
