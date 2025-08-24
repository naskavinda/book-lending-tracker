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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {books.map((book) => (
        <Card key={book._id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="p-0">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full h-40 sm:h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <BookOpenIcon className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-base sm:text-lg line-clamp-2 pr-2">{book.title}</h3>
              <Badge variant={book.status === 'available' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                {book.status}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">by {book.author}</p>
            {book.genre && (
              <Badge variant="outline" className="mb-2 text-xs">
                {book.genre}
              </Badge>
            )}
            {book.description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 sm:line-clamp-3 mb-3">
                {book.description}
              </p>
            )}
            {book.status === 'lent' && book.lentTo && (
              <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 mb-3">
                Lent to {book.lentTo}
                {book.lentDate && <span className="hidden sm:inline"> on {book.lentDate}</span>}
              </p>
            )}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(book)} className="text-xs">
                <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Edit
              </Button>
              {book.status === 'available' && (
                <Button variant="default" size="sm" onClick={() => onLend(book)} className="text-xs">
                  Lend
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => onDelete(book._id)} className="text-xs">
                <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
