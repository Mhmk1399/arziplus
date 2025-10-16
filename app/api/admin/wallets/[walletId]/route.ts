import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import connect from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

interface income {
  status: string;
  amount: number;
  verifiedAt?: Date;
}

interface outcome {
  status: string;
  amount: number;
  verifiedAt?: Date;
}

interface walletData {
  inComes?: income[];
  outComes?: outcome[];
  balance?: string[];
}
async function getAdminUser(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    throw new Error("No token provided or invalid token");
  }

  await connect();
  const user = await User.findById(authUser.id);

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is admin
  if (!user.roles.includes("admin") && !user.roles.includes("super_admin")) {
    throw new Error("Access denied: Admin privileges required");
  }

  return user;
}

// PUT - Update wallet by admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    await connect();

    const { walletId } = await params;
    const body = await request.json();
    const { inComes, outComes, balance } = body;

    // Find the wallet
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        { status: 404 }
      );
    }

    // Update wallet data
    const updateData: walletData = {};

    if (inComes !== undefined) {
      updateData.inComes = inComes.map((income: income) => ({
        ...income,
        verifiedBy: admin._id,
        verifiedAt:
          income.status === "verified" ? new Date() : income.verifiedAt,
      }));
    }

    if (outComes !== undefined) {
      updateData.outComes = outComes.map((outcome: outcome) => ({
        ...outcome,
        verifiedBy: admin._id,
        verifiedAt:
          outcome.status === "verified" ? new Date() : outcome.verifiedAt,
      }));
    }

    if (balance !== undefined) {
      updateData.balance = [
        ...wallet.balance,
        { amount: balance, updatedAt: new Date() },
      ];
    }

    // Update the wallet
    const updatedWallet = await Wallet.findByIdAndUpdate(walletId, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "username firstName lastName phone");

    return NextResponse.json({
      success: true,
      message: "Wallet updated successfully",
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update wallet",
      },
      {
        status:
          error instanceof Error && error.message.includes("Access denied")
            ? 403
            : 500,
      }
    );
  }
}

// GET - Get specific wallet details by admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await getAdminUser(request);
    await connect();

    const { walletId } = await params;

    const wallet = await Wallet.findById(walletId)
      .populate("userId", "username firstName lastName phone")
      .populate("inComes.verifiedBy", "username firstName lastName")
      .populate("outComes.verifiedBy", "username firstName lastName");

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch wallet",
      },
      {
        status:
          error instanceof Error && error.message.includes("Access denied")
            ? 403
            : 500,
      }
    );
  }
}
