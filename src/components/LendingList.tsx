"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, UserIcon, BookOpenIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface LendingRecord {
  _id: string;
  bookTitle: string;
  bookAuthor: string;
  friendName: string;
  lendDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  condition: string;
  returnCondition?: string;
  daysOut: number;
}

interface LendingListProps {
  lendings: LendingRecord[];
  onReturn: (id: string) => void;
  onExtend: (id: string) => void;
  onRemind: (id: string) => void;
}

export default function LendingList({ lendings, onReturn, onExtend, onRemind }: LendingListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'returned': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return ClockIcon;
      case 'returned': return CheckCircleIcon;
      case 'overdue': return ClockIcon;
      default: return ClockIcon;
    }
  };

  return (
    <div className="space-y-4">
      {lendings.map((lending) => {
        const StatusIcon = getStatusIcon(lending.status);
        return (
          <Card key={lending._id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <BookOpenIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lending.bookTitle}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {lending.bookAuthor}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(lending.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {lending.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span>Lent to: <strong>{lending.friendName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>Lend Date: {new Date(lending.lendDate).toLocaleDateString()}</span>
                </div>
                {lending.expectedReturnDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span>Expected Return: {new Date(lending.expectedReturnDate).toLocaleDateString()}</span>
                  </div>
                )}
                {lending.actualReturnDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Returned: {new Date(lending.actualReturnDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span>Days Out: <strong>{lending.daysOut}</strong></span>
                {lending.condition && (
                  <span>Condition: <Badge variant="outline">{lending.condition}</Badge></span>
                )}
              </div>

              {lending.returnCondition && (
                <div className="text-sm">
                  Return Condition: <Badge variant="outline">{lending.returnCondition}</Badge>
                </div>
              )}

              {lending.status === 'active' && (
                <div className="flex gap-2 pt-2">
                  <Button variant="default" size="sm" onClick={() => onReturn(lending._id)}>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Mark Returned
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onExtend(lending._id)}>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Extend Date
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onRemind(lending._id)}>
                    Send Reminder
                  </Button>
                </div>
              )}
              
              {lending.status === 'overdue' && (
                <div className="flex gap-2 pt-2">
                  <Button variant="default" size="sm" onClick={() => onReturn(lending._id)}>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Mark Returned
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onRemind(lending._id)}>
                    Send Urgent Reminder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
