import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import connect from "@/lib/data";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function getUserFromToken(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connect();
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// GET - Get wallet transaction history (incomes and outcomes)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type'); // 'income', 'outcome', or 'all'
    const status = searchParams.get('status'); // 'pending', 'verified', 'rejected'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tag = searchParams.get('tag');

    // Get wallet
    const wallet = await Wallet.findOne({ userId: user._id }).populate('userId', 'firstName lastName phone');
    
    if (!wallet) {
      return NextResponse.json({
        success: true,
        transactions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      });
    }

    let transactions: any[] = [];

    // Build transactions array based on type
    if (!type || type === 'all') {
      transactions = [
        ...wallet.inComes.map(inc => ({...inc.toObject(), type: 'income'})),
        ...wallet.outComes.map(out => ({...out.toObject(), type: 'outcome'}))
      ];
    } else if (type === 'income') {
      transactions = wallet.inComes.map(inc => ({...inc.toObject(), type: 'income'}));
    } else if (type === 'outcome') {
      transactions = wallet.outComes.map(out => ({...out.toObject(), type: 'outcome'}));
    }

    // Apply filters
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    if (tag) {
      transactions = transactions.filter(t => t.tag && t.tag.toLowerCase().includes(tag.toLowerCase()));
    }

    if (startDate) {
      const start = new Date(startDate);
      transactions = transactions.filter(t => new Date(t.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      transactions = transactions.filter(t => new Date(t.date) <= end);
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const total = transactions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalIncome: wallet.inComes
          .filter(inc => inc.status === 'verified')
          .reduce((sum, inc) => sum + inc.amount, 0),
        totalOutcome: wallet.outComes
          .filter(out => out.status === 'verified')
          .reduce((sum, out) => sum + out.amount, 0),
        pendingIncome: wallet.inComes
          .filter(inc => inc.status === 'pending')
          .reduce((sum, inc) => sum + inc.amount, 0),
        pendingOutcome: wallet.outComes
          .filter(out => out.status === 'pending')
          .reduce((sum, out) => sum + out.amount, 0),
      }
    });

  } catch (error: any) {
    console.error("Error fetching wallet history:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  }
}