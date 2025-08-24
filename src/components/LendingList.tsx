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
    <div className="space-y-3 sm:space-y-4">
      {lendings.map((lending) => {
        const StatusIcon = getStatusIcon(lending.status);
        return (
          <Card key={lending._id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6 sm:pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">{lending.bookTitle}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">by {lending.bookAuthor}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(lending.status)} text-xs flex-shrink-0`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {lending.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">Lent to: <strong>{lending.friendName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span>Lend Date: {new Date(lending.lendDate).toLocaleDateString()}</span>
                </div>
                {lending.expectedReturnDate && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span>Expected: {new Date(lending.expectedReturnDate).toLocaleDateString()}</span>
                  </div>
                )}
                {lending.actualReturnDate && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Returned: {new Date(lending.actualReturnDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span>Days Out: <strong>{lending.daysOut}</strong></span>
                {lending.condition && (
                  <span className="flex items-center gap-1">
                    Condition: <Badge variant="outline" className="text-xs">{lending.condition}</Badge>
                  </span>
                )}
              </div>

              {lending.returnCondition && (
                <div className="text-xs sm:text-sm">
                  Return Condition: <Badge variant="outline" className="text-xs">{lending.returnCondition}</Badge>
                </div>
              )}

              {lending.status === 'active' && (
                <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
                  <Button variant="default" size="sm" onClick={() => onReturn(lending._id)} className="text-xs flex-1 sm:flex-none">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Mark Returned</span>
                    <span className="sm:hidden">Return</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onExtend(lending._id)} className="text-xs flex-1 sm:flex-none">
                    <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Extend Date</span>
                    <span className="sm:hidden">Extend</span>
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onRemind(lending._id)} className="text-xs w-full sm:w-auto">
                    <span className="hidden sm:inline">Send Reminder</span>
                    <span className="sm:hidden">Remind</span>
                  </Button>
                </div>
              )}
              
              {lending.status === 'overdue' && (
                <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
                  <Button variant="default" size="sm" onClick={() => onReturn(lending._id)} className="text-xs flex-1 sm:flex-none">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Mark Returned</span>
                    <span className="sm:hidden">Return</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onRemind(lending._id)} className="text-xs flex-1 sm:flex-none">
                    <span className="hidden sm:inline">Send Urgent Reminder</span>
                    <span className="sm:hidden">Urgent Remind</span>
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
