"use client";
import { useState } from 'react';
import FriendForm from '@/components/FriendForm';
import FriendList from '@/components/FriendList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Sample data
const sampleFriends = [
  {
    _id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1-555-0123',
    booksLent: 2,
    currentlyBorrowing: ['To Kill a Mockingbird', 'Pride and Prejudice'],
    totalBorrowedEver: 8,
  },
  {
    _id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1-555-0456',
    booksLent: 0,
    currentlyBorrowing: [],
    totalBorrowedEver: 3,
  },
  {
    _id: '3',
    name: 'Carol Wilson',
    email: 'carol@example.com',
    phone: '',
    booksLent: 1,
    currentlyBorrowing: ['The Hobbit'],
    totalBorrowedEver: 12,
  },
];

export default function FriendsPage() {
  const [friends, setFriends] = useState(sampleFriends);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFriend, setEditingFriend] = useState(null);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (friendData: any) => {
    const newFriend = {
      ...friendData,
      _id: Date.now().toString(),
      booksLent: 0,
      currentlyBorrowing: [],
      totalBorrowedEver: 0,
    };
    setFriends([...friends, newFriend]);
    setShowAddForm(false);
  };

  const handleEditFriend = (friend: any) => {
    setEditingFriend(friend);
    setShowAddForm(true);
  };

  const handleDeleteFriend = (id: string) => {
    setFriends(friends.filter(friend => friend._id !== id));
  };

  const handleViewHistory = (friend: any) => {
    alert(`View lending history for ${friend.name}`);
  };

  const stats = {
    total: friends.length,
    activeBorrowers: friends.filter(f => f.booksLent > 0).length,
    totalBooksOut: friends.reduce((sum, f) => sum + f.booksLent, 0),
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Friends
        </h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Friends</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.activeBorrowers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Borrowers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.totalBooksOut}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Books Currently Out</div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingFriend ? 'Edit Friend' : 'Add New Friend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <FriendForm 
              onSubmit={handleAddFriend} 
              initialData={editingFriend || {}}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddForm(false);
                setEditingFriend(null);
              }}
              className="mt-4"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search friends by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      {filteredFriends.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'No friends found matching your search.' 
                : 'No friends added yet. Add your first friend!'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <FriendList
          friends={filteredFriends}
          onEdit={handleEditFriend}
          onDelete={handleDeleteFriend}
          onViewHistory={handleViewHistory}
        />
      )}
    </div>
  );
}
