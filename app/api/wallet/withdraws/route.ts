import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import WithdrawRequest from "@/models/withdrawRequest";
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
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// GET - Get withdraw requests history
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // Build query
    let query: any = { user: user._id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) {
        query.amount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.amount.$lte = parseFloat(maxAmount);
      }
    }

    // Count total documents
    const total = await WithdrawRequest.countDocuments(query);

    // Get paginated results
    const withdrawRequests = await WithdrawRequest.find(query)
      .populate('user', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate summary statistics
    const allUserWithdraws = await WithdrawRequest.find({ user: user._id });
    
    const summary = {
      totalRequests: allUserWithdraws.length,
      pendingRequests: allUserWithdraws.filter(w => w.status === 'pending').length,
      approvedRequests: allUserWithdraws.filter(w => w.status === 'approved').length,
      rejectedRequests: allUserWithdraws.filter(w => w.status === 'rejected').length,
      totalAmount: allUserWithdraws
        .filter(w => w.status === 'approved')
        .reduce((sum, w) => sum + w.amount, 0),
      pendingAmount: allUserWithdraws
        .filter(w => w.status === 'pending')
        .reduce((sum, w) => sum + w.amount, 0),
    };

    return NextResponse.json({
      success: true,
      withdrawRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary
    });

  } catch (error: any) {
    console.error("Error fetching withdraw requests:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  }
}