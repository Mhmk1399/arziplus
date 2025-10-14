import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import WithdrawRequest from "@/models/withdrawRequest";
import connect from "@/lib/data";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

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

// GET - Get wallet information and statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    // Get or create wallet for user
    let wallet = await Wallet.findOne({ userId: user._id }).populate(
      "userId",
      "firstName lastName phone"
    );

    if (!wallet) {
      wallet = new Wallet({
        userId: user._id,
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
      await wallet.save();
    }

    // Calculate current balance
    const totalIncomes = wallet.inComes
      .filter((income: any) => income.status === "verified")
      .reduce((sum: number, income: any) => sum + income.amount, 0);

    const totalOutcomes = wallet.outComes
      .filter((outcome: any) => outcome.status === "verified")
      .reduce((sum: number, outcome: any) => sum + outcome.amount, 0);

    const currentBalance = totalIncomes - totalOutcomes;

    // Update balance if needed
    const lastBalance = wallet.balance[wallet.balance.length - 1];
    if (!lastBalance || lastBalance.amount !== currentBalance) {
      wallet.balance.push({ amount: currentBalance, updatedAt: new Date() });
      await wallet.save();
    }

    // Get recent transactions (last 10)
    const recentIncomes = wallet.inComes
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);

    const recentOutcomes = wallet.outComes
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);

    // Calculate statistics
    const stats = {
      currentBalance,
      totalIncomes,
      totalOutcomes,
      pendingIncomes: wallet.inComes.filter(
        (income: any) => income.status === "pending"
      ).length,
      pendingOutcomes: wallet.outComes.filter(
        (outcome: any) => outcome.status === "pending"
      ).length,
      verifiedIncomes: wallet.inComes.filter(
        (income: any) => income.status === "verified"
      ).length,
      verifiedOutcomes: wallet.outComes.filter(
        (outcome: any) => outcome.status === "verified"
      ).length,
      recentTransactions: [
        ...recentIncomes.map((inc: any) => ({
          ...inc.toObject(),
          type: "income",
        })),
        ...recentOutcomes.map((out: any) => ({
          ...out.toObject(),
          type: "outcome",
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
    };

    return NextResponse.json({
      success: true,
      wallet: {
        ...wallet.toObject(),
        currentBalance,
      },
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  }
}

// POST - Add income or create withdraw request
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const body = await request.json();
    const { action, amount, description, tag } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Action is required (add_income or withdraw)",
        },
        { status: 400 }
      );
    }

    // Get or create wallet for user
    let wallet = await Wallet.findOne({ userId: user._id });

    if (!wallet) {
      wallet = new Wallet({
        userId: user._id,
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
      await wallet.save();
    }

    if (action === "add_income") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Add income (pending verification)
      wallet.inComes.push({
        amount,
        tag: tag || "manual_deposit",
        description: description || "Manual deposit",
        date: new Date(),
        status: "pending",
      });

      await wallet.save();

      return NextResponse.json({
        success: true,
        message: "Income added successfully (pending verification)",
        wallet: wallet.toObject(),
      });
    } else if (action === "withdraw") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Calculate current balance
      const totalIncomes = wallet.inComes
        .filter((income: any) => income.status === "verified")
        .reduce((sum: number, income: any) => sum + income.amount, 0);

      const totalOutcomes = wallet.outComes
        .filter((outcome: any) => outcome.status === "verified")
        .reduce((sum: number, outcome: any) => sum + outcome.amount, 0);

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

      return NextResponse.json({
        success: true,
        message: "Withdraw request created successfully",
        withdrawRequest: withdrawRequest.toObject(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'add_income' or 'withdraw'",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error processing wallet operation:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  }
}
