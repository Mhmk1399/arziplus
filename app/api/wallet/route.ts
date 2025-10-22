import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import WithdrawRequest from "@/models/withdrawRequest";
import connect from "@/lib/data";

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
  toObject?(): Record<string, unknown>;
}
interface income {
  _id?: string;
  status: "pending" | "verified" | "rejected";
  amount: number;
  verifiedAt?: Date;
  tag?: string;
  description?: string;
  date: Date;
  verifiedBy?: string;
}
interface outcome {
  _id?: string;
  status: "pending" | "verified" | "rejected";
  tag?: string;
  amount: number;
  description?: string;
  verifiedAt?: Date;
  date: Date;
  verifiedBy?: string;
}

interface BalanceEntry {
  amount: number;
  updatedAt: Date;
}

interface WalletData {
  _id: string;
  userId: string | UserData;
  inComes: income[];
  outComes: outcome[];
  balance: BalanceEntry[];
  toObject(): Record<string, unknown>;
  save(): Promise<WalletData>;
}

interface TransactionWithType extends TransactionBase {
  type: "income" | "outcome";
}

interface WalletStats {
  currentBalance: number;
  totalIncomes: number;
  totalOutcomes: number;
  pendingIncomes: number;
  pendingOutcomes: number;
  verifiedIncomes: number;
  verifiedOutcomes: number;
  recentTransactions: TransactionWithType[];
}

interface GetWalletResponse {
  success: boolean;
  wallet: WalletData & { currentBalance: number };
  stats: WalletStats;
}

interface PostWalletRequest {
  action: "add_income" | "withdraw" | "add_outcome";
  amount: number;
  description?: string;
  tag?: string;
}

interface PostWalletResponse {
  success: boolean;
  message: string;
  wallet?: Record<string, unknown>;
  withdrawRequest?: Record<string, unknown>;
}

interface ErrorResponse {
  success: boolean;
  error: string;
}

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

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
  } catch (error) {
    console.log("JWT verification error:", error);
    throw new Error("Invalid token");
  }
}

// GET - Get wallet information and statistics
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetWalletResponse | ErrorResponse>> {
  try {
    const user = await getUserFromToken(request);

    // Get or create wallet for user
    let wallet: WalletData | null = await Wallet.findOne({
      userId: user._id,
    }).populate("userId", "firstName lastName phone");

    if (!wallet) {
      const newWallet = new Wallet({
        userId: user._id,
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
      wallet = await newWallet.save();
    }

    // Type assertion since we know wallet is not null after the check above
    const userWallet = wallet as WalletData;

    // Calculate current balance
    const totalIncomes = userWallet.inComes
      .filter((income: income) => income.status === "verified")
      .reduce((sum: number, income: income) => sum + income.amount, 0);

    const totalOutcomes = userWallet.outComes
      .filter((outcome: outcome) => outcome.status === "verified")
      .reduce((sum: number, outcome: outcome) => sum + outcome.amount, 0);

    const currentBalance = totalIncomes - totalOutcomes;

    // Update balance if needed
    const lastBalance = userWallet.balance[userWallet.balance.length - 1];
    if (!lastBalance || lastBalance.amount !== currentBalance) {
      userWallet.balance.push({
        amount: currentBalance,
        updatedAt: new Date(),
      });
      await userWallet.save();
    }

    // Get recent transactions (last 10)
    const recentIncomes = userWallet.inComes
      .sort(
        (a: income, b: income) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);

    const recentOutcomes = userWallet.outComes
      .sort(
        (a: outcome, b: outcome) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);

    // Calculate statistics
    const stats: WalletStats = {
      currentBalance,
      totalIncomes,
      totalOutcomes,
      pendingIncomes: userWallet.inComes.filter(
        (income: income) => income.status === "pending"
      ).length,
      pendingOutcomes: userWallet.outComes.filter(
        (outcome: outcome) => outcome.status === "pending"
      ).length,
      verifiedIncomes: userWallet.inComes.filter(
        (income: income) => income.status === "verified"
      ).length,
      verifiedOutcomes: userWallet.outComes.filter(
        (outcome: outcome) => outcome.status === "verified"
      ).length,
      recentTransactions: [
        ...recentIncomes.map(
          (inc: income): TransactionWithType => ({
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
        ...recentOutcomes.map(
          (out: outcome): TransactionWithType => ({
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
      ]
        .sort(
          (a: TransactionWithType, b: TransactionWithType) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 10),
    };

    const response: GetWalletResponse = {
      success: true,
      wallet: {
        ...userWallet,
        currentBalance,
      },
      stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.log("Error fetching wallet:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(errorResponse, {
      status: errorMessage === "Invalid token" ? 401 : 500,
    });
  }
}

// POST - Add income or create withdraw request
export async function POST(
  request: NextRequest
): Promise<NextResponse<PostWalletResponse | ErrorResponse>> {
  try {
    const user = await getUserFromToken(request);
    const body: PostWalletRequest = await request.json();
    const { action, amount, description, tag } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Action is required (add_income, withdraw, or add_outcome)",
        },
        { status: 400 }
      );
    }

    // Get or create wallet for user
    let wallet: WalletData | null = await Wallet.findOne({ userId: user._id });

    if (!wallet) {
      const newWallet = new Wallet({
        userId: user._id,
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
      wallet = await newWallet.save();
    }

    // Type assertion since we know wallet is not null after the check above
    const userWallet = wallet as WalletData;

    if (action === "add_income") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Add income (pending verification)
      const newIncome: income = {
        amount,
        tag: tag || "manual_deposit",
        description: description || "Manual deposit",
        date: new Date(),
        status: "pending",
      };
      
      userWallet.inComes.push(newIncome);

      await userWallet.save();

      const response: PostWalletResponse = {
        success: true,
        message: "Income added successfully (pending verification)",
        wallet: userWallet.toObject(),
      };

      return NextResponse.json(response);
    } else if (action === "add_outcome") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Calculate current balance
      const totalIncomes = userWallet.inComes
        .filter((income: income) => income.status === "verified")
        .reduce((sum: number, income: income) => sum + income.amount, 0);

      const totalOutcomes = userWallet.outComes
        .filter((outcome: outcome) => outcome.status === "verified")
        .reduce((sum: number, outcome: outcome) => sum + outcome.amount, 0);

      const currentBalance = totalIncomes - totalOutcomes;

      if (amount > currentBalance) {
        return NextResponse.json(
          { success: false, error: "Insufficient balance" },
          { status: 400 }
        );
      }

      // Add outcome (verified immediately for wallet payments)
      const newOutcome: outcome = {
        amount,
        tag: tag || "wallet_payment",
        description: description || "Wallet payment",
        date: new Date(),
        status: "verified",
        verifiedAt: new Date(),
      };
      
      userWallet.outComes.push(newOutcome);

      // Update balance
      const newBalance = currentBalance - amount;
      userWallet.balance.push({
        amount: newBalance,
        updatedAt: new Date(),
      });

      await userWallet.save();

      const response: PostWalletResponse = {
        success: true,
        message: "Payment deducted from wallet successfully",
        wallet: userWallet.toObject(),
      };

      return NextResponse.json(response);
    } else if (action === "withdraw") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Calculate current balance
      const totalIncomes = userWallet.inComes
        .filter((income: income) => income.status === "verified")
        .reduce((sum: number, income: income) => sum + income.amount, 0);

      const totalOutcomes = userWallet.outComes
        .filter((outcome: outcome) => outcome.status === "verified")
        .reduce((sum: number, outcome: outcome) => sum + outcome.amount, 0);

      const currentBalance = totalIncomes - totalOutcomes;

      if (amount > currentBalance) {
        return NextResponse.json(
          { success: false, error: "Insufficient balance" },
          { status: 400 }
        );
      }

      // Create withdraw request
      const withdrawRequest = new WithdrawRequest({
        user: user._id,
        amount,
        status: "pending",
      });

      await withdrawRequest.save();

      const response: PostWalletResponse = {
        success: true,
        message: "Withdraw request created successfully",
        withdrawRequest: withdrawRequest.toObject(),
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'add_income', 'withdraw', or 'add_outcome'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.log("Error processing wallet operation:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(errorResponse, {
      status: errorMessage === "Invalid token" ? 401 : 500,
    });
  }
}
