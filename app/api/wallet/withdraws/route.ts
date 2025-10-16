import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import WithdrawRequest from "@/models/withdrawRequest";
import connect from "@/lib/data";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

interface JWTPayload {
  userId: string;
}

interface WithdrawRequestData {
  _id: string;
  user: string | {
    _id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface QueryFilters {
  user: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  amount?: {
    $gte?: number;
    $lte?: number;
  };
}

interface WithdrawSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAmount: number;
  pendingAmount: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface GetWithdrawsResponse {
  success: boolean;
  withdrawRequests: WithdrawRequestData[];
  pagination: PaginationInfo;
  summary: WithdrawSummary;
}

interface ErrorResponse {
  success: boolean;
  error: string;
}

async function getUserFromToken(request: NextRequest): Promise<UserData> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    await connect();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("Invalid token");
  }
}

// GET - Get withdraw requests history
export async function GET(request: NextRequest): Promise<NextResponse<GetWithdrawsResponse | ErrorResponse>> {
  try {
    const user = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') as "pending" | "approved" | "rejected" | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // Build query
    const query: QueryFilters = { user: user._id };

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
    const withdrawRequests: WithdrawRequestData[] = await WithdrawRequest.find(query)
      .populate('user', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate summary statistics
    const allUserWithdraws: WithdrawRequestData[] = await WithdrawRequest.find({ user: user._id });
    
    const summary: WithdrawSummary = {
      totalRequests: allUserWithdraws.length,
      pendingRequests: allUserWithdraws.filter((w) => w.status === 'pending').length,
      approvedRequests: allUserWithdraws.filter((w) => w.status === 'approved').length,
      rejectedRequests: allUserWithdraws.filter((w) => w.status === 'rejected').length,
      totalAmount: allUserWithdraws
        .filter((w) => w.status === 'approved')
        .reduce((sum, w) => sum + w.amount, 0),
      pendingAmount: allUserWithdraws
        .filter((w) => w.status === 'pending')
        .reduce((sum, w) => sum + w.amount, 0),
    };

    const responseData: GetWithdrawsResponse = {
      success: true,
      withdrawRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary
    };

    return NextResponse.json(responseData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching withdraw requests:", error);
    
    const errorResponse: ErrorResponse = {
      success: false,
      error: errorMessage
    };
    
    return NextResponse.json(
      errorResponse,
      { status: errorMessage === "Invalid token" ? 401 : 500 }
    );
  }
}