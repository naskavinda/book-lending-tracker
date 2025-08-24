"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpenIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre?: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  tags?: string;
  status: 'available' | 'lent';
  lentTo?: string;
  lentDate?: string;
}

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onLend: (book: Book) => void;
}

export default function BookList({ books, onEdit, onDelete, onLend }: BookListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book._id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="p-0">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <BookOpenIcon className="h-16 w-16 text-blue-500" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg line-clamp-2">{book.title}</h3>
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
                Lent to {book.lentTo} on {book.lentDate}
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(book)}>
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {book.status === 'available' && (
                <Button variant="default" size="sm" onClick={() => onLend(book)}>
                  Lend
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => onDelete(book._id)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
