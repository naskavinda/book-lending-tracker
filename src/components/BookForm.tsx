"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles } from 'lucide-react';

export default function BookForm({ onSubmit, initialData = {} }: { onSubmit: (data: any) => void, initialData?: any }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [author, setAuthor] = useState(initialData.author || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [isbn, setIsbn] = useState(initialData.isbn || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || '');
  const [tags, setTags] = useState(initialData.tags || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, author, genre, isbn, description, coverUrl, tags });
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          Add New Book
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
                placeholder="Enter book title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
                placeholder="Enter author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium">Genre</Label>
              <Input
                id="genre"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
                placeholder="Fiction, Non-fiction, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn" className="text-sm font-medium">ISBN</Label>
              <Input
                id="isbn"
                value={isbn}
                onChange={e => setIsbn(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
                placeholder="978-0000000000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-background min-h-[80px] resize-none"
              placeholder="Brief description of the book"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl" className="text-sm font-medium">Cover Image URL</Label>
            <Input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-slate-700"
              placeholder="fantasy, adventure, bestseller"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Save Book
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
