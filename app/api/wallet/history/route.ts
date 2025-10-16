import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import connect from "@/lib/data";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

interface JWTPayload {
  id: string;
}

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface TransactionBase {
  _id?: string;
  amount: number;
  tag?: string;
  description?: string;
  date: Date;
  verifiedAt?: Date;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  toObject(): Record<string, unknown>;
}
interface Income {
  _id: string;
  amount: number;
  tag: string;
  description: string;
  date: Date;
  verifiedAt: Date;
  verifiedBy: string;
  status: "pending" | "verified" | "rejected";
}
interface Outcome {
  _id: string;
  amount: number;
  tag: string;
  description: string;
  date: Date;
  verifiedAt: Date;
  verifiedBy: string;
  status: "pending" | "verified" | "rejected";
}

interface TransactionWithType extends Omit<TransactionBase, "toObject"> {
  type: "income" | "outcome";
}

interface WalletData {
  _id: string;
  userId: string | UserData;
  inComes: Income[];
  outComes: Outcome[];
  balance: Array<{ amount: number; updatedAt: Date }>;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface WalletSummary {
  totalIncome: number;
  totalOutcome: number;
  pendingIncome: number;
  pendingOutcome: number;
}

interface GetHistoryResponse {
  success: boolean;
  transactions: TransactionWithType[];
  pagination: PaginationData;
  summary: WalletSummary;
}

interface EmptyHistoryResponse {
  success: boolean;
  transactions: TransactionWithType[];
  pagination: PaginationData;
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
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch {
    throw new Error("Invalid token");
  }
}

// GET - Get wallet transaction history (incomes and outcomes)
export async function GET(
  request: NextRequest
): Promise<
  NextResponse<GetHistoryResponse | EmptyHistoryResponse | ErrorResponse>
> {
  try {
    const user = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") as
      | "income"
      | "outcome"
      | "all"
      | null;
    const status = searchParams.get("status") as
      | "pending"
      | "verified"
      | "rejected"
      | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const tag = searchParams.get("tag");

    // Get wallet
    const wallet: WalletData | null = await Wallet.findOne({
      userId: user._id,
    }).populate("userId", "firstName lastName phone");

    if (!wallet) {
      const emptyResponse: EmptyHistoryResponse = {
        success: true,
        transactions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      };
      return NextResponse.json(emptyResponse);
    }

    let transactions: TransactionWithType[] = [];

    // Build transactions array based on type
    if (!type || type === "all") {
      transactions = [
        ...wallet.inComes.map(
          (inc: Income): TransactionWithType => ({
            _id: inc._id,
            amount: inc.amount,
            tag: inc.tag,
            description: inc.description,
            date: inc.date,
            verifiedAt: inc.verifiedAt,
            status: inc.status,
            verifiedBy: inc.verifiedBy,
            type: "income" as const,
          })
        ),
        ...wallet.outComes.map(
          (out: Outcome): TransactionWithType => ({
            _id: out._id,
            amount: out.amount,
            tag: out.tag,
            description: out.description,
            date: out.date,
            verifiedAt: out.verifiedAt,
            status: out.status,
            verifiedBy: out.verifiedBy,
            type: "outcome" as const,
          })
        ),
      ];
    } else if (type === "income") {
      transactions = wallet.inComes.map(
        (inc: Income): TransactionWithType => ({
          _id: inc._id,
          amount: inc.amount,
          tag: inc.tag,
          description: inc.description,
          date: inc.date,
          verifiedAt: inc.verifiedAt,
          status: inc.status,
          verifiedBy: inc.verifiedBy,
          type: "income" as const,
        })
      );
    } else if (type === "outcome") {
      transactions = wallet.outComes.map(
        (out: Outcome): TransactionWithType => ({
          _id: out._id,
          amount: out.amount,
          tag: out.tag,
          description: out.description,
          date: out.date,
          verifiedAt: out.verifiedAt,
          status: out.status,
          verifiedBy: out.verifiedBy,
          type: "outcome" as const,
        })
      );
    }

    // Apply filters
    if (status) {
      transactions = transactions.filter(
        (t: TransactionWithType) => t.status === status
      );
    }

    if (tag) {
      transactions = transactions.filter(
        (t: TransactionWithType) =>
          t.tag && t.tag.toLowerCase().includes(tag.toLowerCase())
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      transactions = transactions.filter(
        (t: TransactionWithType) => new Date(t.date) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      transactions = transactions.filter(
        (t: TransactionWithType) => new Date(t.date) <= end
      );
    }

    // Sort by date (newest first)
    transactions.sort(
      (a: TransactionWithType, b: TransactionWithType) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Pagination
    const total = transactions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    const summary: WalletSummary = {
      totalIncome: wallet.inComes
        .filter((inc: Income) => inc.status === "verified")
        .reduce((sum: number, inc: Income) => sum + inc.amount, 0),
      totalOutcome: wallet.outComes
        .filter((out: Outcome) => out.status === "verified")
        .reduce((sum: number, out: Outcome) => sum + out.amount, 0),
      pendingIncome: wallet.inComes
        .filter((inc: Income) => inc.status === "pending")
        .reduce((sum: number, inc: Income) => sum + inc.amount, 0),
      pendingOutcome: wallet.outComes
        .filter((out: Outcome) => out.status === "pending")
        .reduce((sum: number, out: Outcome) => sum + out.amount, 0),
    };

    const response: GetHistoryResponse = {
      success: true,
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching wallet history:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(errorResponse, {
      status: errorMessage === "Invalid token" ? 401 : 500,
    });
  }
}
