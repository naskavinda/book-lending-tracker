"use client";
import { useState } from 'react';
import LendForm from '@/components/LendForm';
import LendingList from '@/components/LendingList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Sample data
const books = [
  { _id: '1', title: 'The Great Gatsby' },
  { _id: '2', title: 'Dune' },
  { _id: '3', title: '1984' },
];

const friends = [
  { _id: '1', name: 'Alice Johnson' },
  { _id: '2', name: 'Bob Smith' },
  { _id: '3', name: 'Carol Wilson' },
];

const sampleLendings = [
  {
    _id: '1',
    bookTitle: 'To Kill a Mockingbird',
    bookAuthor: 'Harper Lee',
    friendName: 'Alice Johnson',
    lendDate: '2024-01-15',
    expectedReturnDate: '2024-02-15',
    actualReturnDate: '',
    status: 'overdue' as const,
    condition: 'Good',
    returnCondition: '',
    daysOut: 45,
  },
  {
    _id: '2',
    bookTitle: 'The Hobbit',
    bookAuthor: 'J.R.R. Tolkien',
    friendName: 'Carol Wilson',
    lendDate: '2024-02-01',
    expectedReturnDate: '2024-03-01',
    actualReturnDate: '',
    status: 'active' as const,
    condition: 'Excellent',
    returnCondition: '',
    daysOut: 23,
  },
  {
    _id: '3',
    bookTitle: 'Pride and Prejudice',
    bookAuthor: 'Jane Austen',
    friendName: 'Alice Johnson',
    lendDate: '2023-12-01',
    expectedReturnDate: '2024-01-01',
    actualReturnDate: '2023-12-28',
    status: 'returned' as const,
    condition: 'Good',
    returnCondition: 'Fair',
    daysOut: 27,
  },
];

export default function LendPage() {
  const [lendings, setLendings] = useState(sampleLendings);
  const [showLendForm, setShowLendForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLendings = lendings.filter(lending => {
    const matchesSearch = lending.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lending.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lending.friendName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lending.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLend = (lendData: any) => {
    const newLending = {
      ...lendData,
      _id: Date.now().toString(),
      bookTitle: books.find(b => b._id === lendData.bookId)?.title || 'Unknown Book',
      bookAuthor: 'Unknown Author',
      friendName: friends.find(f => f._id === lendData.friendId)?.name || 'Unknown Friend',
      actualReturnDate: '',
      status: 'active' as const,
      returnCondition: '',
      daysOut: 0,
    };
    setLendings([...lendings, newLending]);
    setShowLendForm(false);
  };

  const handleReturn = (id: string) => {
    setLendings(lendings.map(lending => 
      lending._id === id 
        ? { ...lending, status: 'returned' as const, actualReturnDate: new Date().toISOString().split('T')[0] }
        : lending
    ));
  };

  const handleExtend = (id: string) => {
    alert(`Extend lending period for record ${id}`);
  };

  const handleRemind = (id: string) => {
    alert(`Send reminder for record ${id}`);
  };

  const stats = {
    total: lendings.length,
    active: lendings.filter(l => l.status === 'active').length,
    overdue: lendings.filter(l => l.status === 'overdue').length,
    returned: lendings.filter(l => l.status === 'returned').length,
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Lending Records
        </h1>
        <Button onClick={() => setShowLendForm(!showLendForm)} className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Lending
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Returned</div>
          </CardContent>
        </Card>
      </div>

      {/* Lend Form */}
      {showLendForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Lending Record</CardTitle>
          </CardHeader>
          <CardContent>
            <LendForm 
              books={books} 
              friends={friends} 
              onSubmit={handleLend}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowLendForm(false)}
              className="mt-4"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by book, author, or friend..."
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
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lending List */}
      {filteredLendings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'No lending records found matching your criteria.' 
                : 'No lending records yet. Start lending your first book!'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <LendingList
          lendings={filteredLendings}
          onReturn={handleReturn}
          onExtend={handleExtend}
          onRemind={handleRemind}
        />
      )}
    </div>
  );
}
