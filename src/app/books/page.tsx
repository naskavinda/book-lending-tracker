"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, BookOpen, Edit, Trash2 } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

interface Book {
  _id: string;
  title: string;
  author: string;
  originalTitle?: string;
  originalAuthor?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  tags?: string;
  status: 'available' | 'lent';
  lentTo?: string;
  lentDate?: string;
}

interface BookFormData {
  title: string;
  author: string;
  originalTitle?: string;
  originalAuthor?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  tags?: string;
}

function BookForm({ onSubmit, initialData = {}, onCancel }: { 
  onSubmit: (data: BookFormData) => void, 
  initialData?: Partial<BookFormData>,
  onCancel: () => void 
}) {
  const [title, setTitle] = useState(initialData.title || '');
  const [author, setAuthor] = useState(initialData.author || '');
  const [originalTitle, setOriginalTitle] = useState(initialData.originalTitle || '');
  const [originalAuthor, setOriginalAuthor] = useState(initialData.originalAuthor || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [isbn, setIsbn] = useState(initialData.isbn || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || '');
  const [tags, setTags] = useState(initialData.tags || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      author, 
      originalTitle: originalTitle || undefined,
      originalAuthor: originalAuthor || undefined,
      genre: genre || undefined, 
      isbn: isbn || undefined, 
      description: description || undefined, 
      coverUrl: coverUrl || undefined, 
      tags: tags || undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <Input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Title (if translated)</label>
          <Input
            value={originalTitle}
            onChange={e => setOriginalTitle(e.target.value)}
            placeholder="Original title in original language"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Author (if translated)</label>
          <Input
            value={originalAuthor}
            onChange={e => setOriginalAuthor(e.target.value)}
            placeholder="Original author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <Input
            value={genre}
            onChange={e => setGenre(e.target.value)}
            placeholder="Fiction, Non-fiction, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ISBN</label>
          <Input
            value={isbn}
            onChange={e => setIsbn(e.target.value)}
            placeholder="978-0000000000"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[80px] resize-none"
          placeholder="Brief description of the book"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
        <Input
          type="url"
          value={coverUrl}
          onChange={e => setCoverUrl(e.target.value)}
          placeholder="https://example.com/cover.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <Input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="fantasy, adventure, bestseller"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Book
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function BookList({ books, onEdit, onDelete, onLend }: {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onLend: (book: Book) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <Card key={book._id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="p-0">
            {book.coverUrl ? (
              <div className="w-full h-48 overflow-hidden">
                <Image 
                  src={book.coverUrl} 
                  alt={book.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-blue-500" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg line-clamp-2 pr-2">{book.title}</h3>
              <Badge variant={book.status === 'available' ? 'default' : 'secondary'}>
                {book.status}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
            {book.genre && (
              <Badge variant="outline" className="mb-2">
                {book.genre}
              </Badge>
            )}
            {book.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-3">
                {book.description}
              </p>
            )}
            {book.status === 'lent' && book.lentTo && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                Lent to {book.lentTo}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(book)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {book.status === 'available' && (
                <Button size="sm" onClick={() => onLend(book)}>
                  Lend
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => onDelete(book._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { updateBookCount } = useSidebar();

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log('Fetching books...');
      const response = await apiGet('/api/books');
      console.log('Books response status:', response.status);
      const data = await response.json();
      console.log('Books data:', data);
      if (data.success) {
        setBooks(data.data);
      } else {
        console.error('Failed to fetch books:', data.error);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const response = await apiPost('/api/books', bookData);

      const data = await response.json();
      if (data.success) {
        setBooks([data.data, ...books]);
        setShowAddForm(false);
        setEditingBook(null);
        updateBookCount(1); // Increment sidebar count
      } else {
        console.error('Failed to add book:', data.error);
        alert('Failed to add book. Please try again.');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowAddForm(true);
  };

  const handleUpdateBook = async (bookData: BookFormData) => {
    if (!editingBook) return;

    try {
      const response = await apiPut(`/api/books/${editingBook._id}`, bookData);

      const data = await response.json();
      if (data.success) {
        setBooks(books.map(book => 
          book._id === editingBook._id ? data.data : book
        ));
        setShowAddForm(false);
        setEditingBook(null);
      } else {
        console.error('Failed to update book:', data.error);
        alert('Failed to update book. Please try again.');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please try again.');
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await apiDelete(`/api/books/${id}`);

      const data = await response.json();
      if (data.success) {
        setBooks(books.filter(book => book._id !== id));
        updateBookCount(-1); // Decrement sidebar count
      } else {
        console.error('Failed to delete book:', data.error);
        alert('Failed to delete book. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book. Please try again.');
    }
  };

  const handleLendBook = (book: Book) => {
    alert(`Lend book: ${book.title} - Feature coming soon!`);
  };

  const stats = {
    total: books.length,
    available: books.filter(b => b.status === 'available').length,
    lent: books.filter(b => b.status === 'lent').length,
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Books</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
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
              onSubmit={editingBook ? handleUpdateBook : handleAddBook} 
              initialData={editingBook || {}}
              onCancel={() => {
                setShowAddForm(false);
                setEditingBook(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md bg-background"
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
