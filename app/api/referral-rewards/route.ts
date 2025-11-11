import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import ReferralReward from "@/models/ReferralReward";
import Referral from "@/models/Referral";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import { getAuthUser } from "@/lib/auth";

// Type definitions
interface RewardQueryFilter {
  user?: string;
  status?: string;
  rewardType?: string;
}

interface CreateRewardBody {
  referralId: string;
  userId: string;
  rewardType: "wallet_credit" | "discount" | "service_upgrade";
  value: number;
}

interface UpdateRewardBody {
  id: string;
  status?: "pending" | "claimed" | "expired";
}

// GET - Retrieve referral rewards
export async function GET(request: NextRequest) {
  try {
    await connect();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const rewardType = searchParams.get("rewardType");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Check if user is admin
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    // If specific reward ID is requested
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const reward = await ReferralReward.findById(id)
        .populate({
          path: "referral",
          populate: [
            { path: "referrer", select: "nationalCredentials.firstName nationalCredentials.lastName" },
            { path: "referee", select: "nationalCredentials.firstName nationalCredentials.lastName" }
          ]
        })
        .populate("user", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email");

      if (!reward) {
        return NextResponse.json(
          { success: false, message: "Reward not found" },
          { status: 404 }
        );
      }

      // Check permissions
      if (!isAdmin && reward.user.toString() !== authUser.id) {
        return NextResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: reward });
    }

    // Build query filters
    const query: RewardQueryFilter = {};

    if (status) {
      query.status = status;
    }

    if (rewardType) {
      query.rewardType = rewardType;
    }

    // If not admin, only show user's own rewards
    if (!isAdmin) {
      query.user = authUser.id;
    } else if (userId) {
      // Admin can filter by specific user
      query.user = userId;
    }

    const skip = (page - 1) * limit;
    const rewards = await ReferralReward.find(query)
      .populate({
        path: "referral",
        populate: [
          { path: "referrer", select: "nationalCredentials.firstName nationalCredentials.lastName" },
          { path: "referee", select: "nationalCredentials.firstName nationalCredentials.lastName" }
        ]
      })
      .populate("user", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ReferralReward.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: rewards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.log("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new referral reward
export async function POST(request: NextRequest) {
  try {
    await connect();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Only admins can create rewards manually
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const body: CreateRewardBody = await request.json();
    const { referralId, userId, rewardType, value } = body;

    // Validate required fields
    if (!referralId || !userId || !rewardType || !value) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate referral exists
    if (!mongoose.Types.ObjectId.isValid(referralId)) {
      return NextResponse.json(
        { success: false, message: "Invalid referral ID format" },
        { status: 400 }
      );
    }

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return NextResponse.json(
        { success: false, message: "Referral not found" },
        { status: 404 }
      );
    }

    // Validate user exists
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Create new reward
    const newReward = new ReferralReward({
      referral: referralId,
      user: userId,
      rewardType,
      value,
      status: "pending",
    });

    await newReward.save();

   

    return NextResponse.json(
      {
        success: true,
        message: "Reward created successfully",
        data: newReward,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("POST Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update reward status or claim reward
export async function PUT(request: NextRequest) {
  try {
    await connect();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body: UpdateRewardBody = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Find the reward
    const reward = await ReferralReward.findById(id);
    if (!reward) {
      return NextResponse.json(
        { success: false, message: "Reward not found" },
        { status: 404 }
      );
    }

    // Check if user is admin
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    // Check permissions - user can only claim their own rewards
    if (!isAdmin && reward.user.toString() !== authUser.id) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    // If user is claiming the reward
    if (status === "claimed" && !isAdmin) {
      // Check if reward is already claimed or expired
      if (reward.status === "claimed") {
        return NextResponse.json(
          { success: false, message: "Reward already claimed" },
          { status: 400 }
        );
      }

      if (reward.status === "expired") {
        return NextResponse.json(
          { success: false, message: "Reward has expired" },
          { status: 400 }
        );
      }

      // Apply reward based on type
      if (reward.rewardType === "wallet_credit") {
        // Get or create wallet for user
        let wallet = await Wallet.findOne({ userId: reward.user });
        
        if (!wallet) {
          wallet = new Wallet({
            userId: reward.user,
            inComes: [],
            outComes: [],
            balance: [{ amount: 0, updatedAt: new Date() }],
          });
        }

        // Add income transaction with "verified" status
        wallet.inComes.push({
          amount: reward.value,
          tag: "referral_reward",
          description: "پاداش معرفی",
          date: new Date(),
          status: "verified",
          verifiedAt: new Date(),
        });

        // Calculate new balance
        const totalIncomes = wallet.inComes
          .filter((income: any) => income.status === "verified")
          .reduce((sum: number, income: any) => sum + income.amount, 0);

        const totalOutcomes = wallet.outComes
          .filter((outcome: any) => outcome.status === "verified")
          .reduce((sum: number, outcome: any) => sum + outcome.amount, 0);

        const newBalance = totalIncomes - totalOutcomes;

        // Update balance
        wallet.balance.push({
          amount: newBalance,
          updatedAt: new Date(),
        });

        await wallet.save();

        // Also update user's wallet balance field
        await User.findByIdAndUpdate(reward.user, {
          "wallet.balance": newBalance,
        });
      }

      // Update reward status and set claimed date
      reward.status = "claimed";
      reward.claimedAt = new Date();
      await reward.save();

      await reward.populate("referral");
      await reward.populate("user", "nationalCredentials.firstName nationalCredentials.lastName");

      return NextResponse.json({
        success: true,
        message: "Reward claimed successfully",
        data: reward,
      });
    }

    // Admin can update any status
    if (isAdmin && status) {
      const updateFields: any = { status };
      
      if (status === "claimed" && !reward.claimedAt) {
        updateFields.claimedAt = new Date();
      }

      const updatedReward = await ReferralReward.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      )
        .populate("referral")
        .populate("user", "nationalCredentials.firstName nationalCredentials.lastName");

      return NextResponse.json({
        success: true,
        message: "Reward updated successfully",
        data: updatedReward,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid update operation" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.log("PUT Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a reward
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Only admins can delete rewards
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body: { id: string } = await request.json();
        id = body.id;
      } catch {
        // Continue with null id
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const deletedReward = await ReferralReward.findByIdAndDelete(id);

    if (!deletedReward) {
      return NextResponse.json(
        { success: false, message: "Reward not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reward deleted successfully",
      data: deletedReward,
    });
  } catch (error: unknown) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
