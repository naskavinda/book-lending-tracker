import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Book, Lending } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get books statistics
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ status: 'available' });
    const lentBooks = await Book.countDocuments({ status: 'lent' });
    
    // Get lending statistics
    const totalLendings = await Lending.countDocuments();
    const activeLendings = await Lending.countDocuments({ status: 'active' });
    const overdueLendings = await Lending.countDocuments({ status: 'overdue' });
    
    // Get monthly lending data for chart
    const currentYear = new Date().getFullYear();
    const monthlyLendings = await Lending.aggregate([
      {
        $match: {
          lendDate: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$lendDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Create monthly data array (12 months)
    const monthlyData = new Array(12).fill(0);
    monthlyLendings.forEach(item => {
      monthlyData[item._id - 1] = item.count;
    });

    const stats = {
      books: {
        total: totalBooks,
        available: availableBooks,
        lent: lentBooks,
        overdue: overdueLendings
      },
      lendings: {
        total: totalLendings,
        active: activeLendings,
        overdue: overdueLendings
      },
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: monthlyData
      }
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
