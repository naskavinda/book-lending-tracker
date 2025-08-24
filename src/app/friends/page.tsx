"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, User, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

interface Friend {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  booksLent?: number;
  lastLentDate?: string;
}

interface FriendFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

function FriendForm({ onSubmit, initialData = {}, onCancel }: { 
  onSubmit: (data: FriendFormData) => void, 
  initialData?: Partial<FriendFormData>,
  onCancel: () => void 
}) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [notes, setNotes] = useState(initialData.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, address, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Enter friend's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="friend@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Main St, City, State"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[80px] resize-none"
          placeholder="Any additional notes about this friend"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Friend
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function FriendList({ friends, onEdit, onDelete }: {
  friends: Friend[];
  onEdit: (friend: Friend) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <Card key={friend._id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{friend.name}</h3>
                  {friend.booksLent && friend.booksLent > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {friend.booksLent} books borrowed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 mb-4">
              {friend.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{friend.email}</span>
                </div>
              )}
              {friend.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>{friend.phone}</span>
                </div>
              )}
              {friend.address && (
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  📍 {friend.address}
                </div>
              )}
              {friend.notes && (
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  💭 {friend.notes}
                </div>
              )}
              {friend.lastLentDate && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  Last borrowed: {new Date(friend.lastLentDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(friend)} className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(friend._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const { updateFriendCount } = useSidebar();

  // Fetch friends from API
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/friends');
      const data = await response.json();
      if (data.success) {
        setFriends(data.data);
      } else {
        console.error('Failed to fetch friends:', data.error);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.phone?.includes(searchTerm)
  );

  const handleAddFriend = async (friendData: FriendFormData) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendData),
      });

      const data = await response.json();
      if (data.success) {
        setFriends([data.data, ...friends]);
        setShowAddForm(false);
        setEditingFriend(null);
        updateFriendCount(1); // Increment sidebar count
      } else {
        console.error('Failed to add friend:', data.error);
        alert('Failed to add friend. Please try again.');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to add friend. Please try again.');
    }
  };

  const handleEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setShowAddForm(true);
  };

  const handleUpdateFriend = async (friendData: FriendFormData) => {
    if (!editingFriend) return;

    try {
      const response = await fetch(`/api/friends/${editingFriend._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendData),
      });

      const data = await response.json();
      if (data.success) {
        setFriends(friends.map(friend => 
          friend._id === editingFriend._id ? data.data : friend
        ));
        setShowAddForm(false);
        setEditingFriend(null);
      } else {
        console.error('Failed to update friend:', data.error);
        alert('Failed to update friend. Please try again.');
      }
    } catch (error) {
      console.error('Error updating friend:', error);
      alert('Failed to update friend. Please try again.');
    }
  };

  const handleDeleteFriend = async (id: string) => {
    if (!confirm('Are you sure you want to delete this friend?')) return;

    try {
      const response = await fetch(`/api/friends/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setFriends(friends.filter(friend => friend._id !== id));
        updateFriendCount(-1); // Decrement sidebar count
      } else {
        console.error('Failed to delete friend:', data.error);
        alert('Failed to delete friend. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      alert('Failed to delete friend. Please try again.');
    }
  };

  const stats = {
    total: friends.length,
    withBooks: friends.filter(f => f.booksLent && f.booksLent > 0).length,
    totalBooksLent: friends.reduce((sum, f) => sum + (f.booksLent || 0), 0),
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Friends</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
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
            <div className="text-2xl font-bold text-amber-600">{stats.withBooks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">With Borrowed Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalBooksLent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Books Lent</div>
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
              onSubmit={editingFriend ? handleUpdateFriend : handleAddFriend} 
              initialData={editingFriend || {}}
              onCancel={() => {
                setShowAddForm(false);
                setEditingFriend(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search friends by name, email, or phone..."
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
        />
      )}
    </div>
  );
}
