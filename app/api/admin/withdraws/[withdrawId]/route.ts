import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import WithdrawRequest from "@/models/withdrawRequest";
import Wallet from "@/models/wallet";
import connect from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

interface updateData {
  status: "pending" | "approved" | "rejected";
  rejectionReason: string;
  updatedAt: Date;
  processedBy: string;
  processedAt: Date;
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

// PATCH - Update withdraw request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { withdrawId: string } }
) {
  try {
    const admin = await getAdminUser(request);
    await connect();

    const { withdrawId } = params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be pending, approved, or rejected",
        },
        { status: 400 }
      );
    }

    // Find the withdraw request
    const withdrawRequest = await WithdrawRequest.findById(withdrawId).populate(
      "user"
    );
    if (!withdrawRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Withdraw request not found",
        },
        { status: 404 }
      );
    }

    // Don't allow changing status of already processed requests
    if (withdrawRequest.status !== "pending" && status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot change status of already processed request",
        },
        { status: 400 }
      );
    }

    // If approving the withdrawal, update user's wallet
    if (status === "approved" && withdrawRequest.status === "pending") {
      // Find user's wallet
      const wallet = await Wallet.findOne({ userId: withdrawRequest.user._id });
      if (!wallet) {
        return NextResponse.json(
          {
            success: false,
            message: "User wallet not found",
          },
          { status: 404 }
        );
      }

      // Add outcome transaction to wallet
      const outcomeTransaction = {
        amount: withdrawRequest.amount,
        tag: "withdrawal",
        description: `Withdraw request approved - ID: ${withdrawRequest._id}`,
        date: new Date(),
        verifiedAt: new Date(),
        status: "verified",
        verifiedBy: admin._id,
      };

      wallet.outComes.push(outcomeTransaction);

      // Update balance
      const currentBalance =
        wallet.balance.length > 0
          ? wallet.balance[wallet.balance.length - 1].amount
          : 0;
      const newBalance = currentBalance - withdrawRequest.amount;

      wallet.balance.push({
        amount: newBalance,
        updatedAt: new Date(),
      });

      await wallet.save();
    }

    // Update withdraw request status
    const updateData: updateData = {
      status,
      updatedAt: new Date(),
      processedBy: admin._id,
      processedAt: new Date(),
      rejectionReason,
    };

    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedWithdrawRequest = await WithdrawRequest.findByIdAndUpdate(
      withdrawId,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "username firstName lastName phone");

    return NextResponse.json({
      success: true,
      message: `Withdraw request ${status} successfully`,
      withdrawRequest: updatedWithdrawRequest,
    });
  } catch (error) {
    console.error("Error updating withdraw request:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update withdraw request",
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

// GET - Get specific withdraw request details
export async function GET(
  request: NextRequest,
  { params }: { params: { withdrawId: string } }
) {
  try {
    await getAdminUser(request);
    await connect();

    const { withdrawId } = params;

    const withdrawRequest = await WithdrawRequest.findById(withdrawId)
      .populate(
        "user",
        "username firstName lastName phone contactInfo bankingInfo"
      )
      .populate("processedBy", "username firstName lastName");

    if (!withdrawRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Withdraw request not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      withdrawRequest,
    });
  } catch (error) {
    console.error("Error fetching withdraw request:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch withdraw request",
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
