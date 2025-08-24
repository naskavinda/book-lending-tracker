"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserIcon, PencilIcon, TrashIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface Friend {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  booksLent: number;
  currentlyBorrowing: string[];
  totalBorrowedEver: number;
}

interface FriendListProps {
  friends: Friend[];
  onEdit: (friend: Friend) => void;
  onDelete: (id: string) => void;
  onViewHistory: (friend: Friend) => void;
}

export default function FriendList({ friends, onEdit, onDelete, onViewHistory }: FriendListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {friends.map((friend) => (
        <Card key={friend._id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {friend.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{friend.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{friend.booksLent} currently borrowed</Badge>
                  <Badge variant="secondary">{friend.totalBorrowedEver} total</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {friend.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="h-4 w-4" />
                {friend.email}
              </div>
            )}
            {friend.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-4 w-4" />
                {friend.phone}
              </div>
            )}
            {friend.currentlyBorrowing.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Currently Borrowing:</p>
                <div className="space-y-1">
                  {friend.currentlyBorrowing.map((book, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {book}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(friend)}>
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="default" size="sm" onClick={() => onViewHistory(friend)}>
                <UserIcon className="h-4 w-4 mr-1" />
                History
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(friend._id)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
