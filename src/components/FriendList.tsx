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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {friends.map((friend) => (
        <Card key={friend._id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3 p-3 sm:p-6 sm:pb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {friend.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg truncate">{friend.name}</CardTitle>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{friend.booksLent} borrowed</Badge>
                  <Badge variant="secondary" className="text-xs">{friend.totalBorrowedEver} total</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
            {friend.email && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{friend.email}</span>
              </div>
            )}
            {friend.phone && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{friend.phone}</span>
              </div>
            )}
            {friend.currentlyBorrowing.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1">Currently Borrowing:</p>
                <div className="space-y-1">
                  {friend.currentlyBorrowing.slice(0, 2).map((book, index) => (
                    <Badge key={index} variant="outline" className="text-xs block truncate">
                      {book}
                    </Badge>
                  ))}
                  {friend.currentlyBorrowing.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{friend.currentlyBorrowing.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(friend)} className="text-xs flex-1 sm:flex-none">
                <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Edit
              </Button>
              <Button variant="default" size="sm" onClick={() => onViewHistory(friend)} className="text-xs flex-1 sm:flex-none">
                <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">History</span>
                <span className="sm:hidden">View</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(friend._id)} className="text-xs">
                <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
