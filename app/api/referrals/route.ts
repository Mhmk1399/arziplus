import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Referral from "@/models/Referral";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

// Type definitions
interface ReferralQueryFilter {
  referrer?: string;
  referee?: string;
  status?: string;
}

interface CreateReferralBody {
  referralCode: string;
  refereeId: string;
}

interface UpdateReferralBody {
  id: string;
  status?: "pending" | "completed" | "rewarded" | "expired";
  rewardAmount?: number;
}

// GET - Retrieve referrals with filters
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
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Check if user is admin
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    // If specific referral ID is requested
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const referral = await Referral.findById(id)
        .populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email")
        .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email");

      if (!referral) {
        return NextResponse.json(
          { success: false, message: "Referral not found" },
          { status: 404 }
        );
      }

      // Check permissions - user can only see their own referrals unless admin
      if (
        !isAdmin &&
        referral.referrer.toString() !== authUser.id &&
        referral.referee.toString() !== authUser.id
      ) {
        return NextResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: referral });
    }

    // Build query filters
    const query: ReferralQueryFilter = {};

    if (status) {
      query.status = status;
    }

    // If not admin, only show user's own referrals
    if (!isAdmin) {
      query.referrer = authUser.id;
    } else if (userId) {
      // Admin can filter by specific user
      query.referrer = userId;
    }

    const skip = (page - 1) * limit;
    const referrals = await Referral.find(query)
      .populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email referralCode")
      .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Referral.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: referrals,
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

// POST - Create a new referral
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

    const body: CreateReferralBody = await request.json();
    const { referralCode, refereeId } = body;

    // Validate required fields
    if (!referralCode || !refereeId) {
      return NextResponse.json(
        { success: false, message: "Referral code and referee ID are required" },
        { status: 400 }
      );
    }

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return NextResponse.json(
        { success: false, message: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Validate referee exists
    if (!mongoose.Types.ObjectId.isValid(refereeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid referee ID format" },
        { status: 400 }
      );
    }

    const referee = await User.findById(refereeId);
    if (!referee) {
      return NextResponse.json(
        { success: false, message: "Referee not found" },
        { status: 404 }
      );
    }

    // Check if referee already has a referral
    const existingReferral = await Referral.findOne({ referee: refereeId });
    if (existingReferral) {
      return NextResponse.json(
        { success: false, message: "User has already been referred" },
        { status: 400 }
      );
    }

    // Prevent self-referral
    if (referrer._id.toString() === refereeId) {
      return NextResponse.json(
        { success: false, message: "Cannot refer yourself" },
        { status: 400 }
      );
    }

    // Create new referral
    const newReferral = new Referral({
      referrer: referrer._id,
      referee: refereeId,
      referralCode,
      status: "pending",
      rewardAmount: 0,
    });

    await newReferral.save();

    // Update referee's referredBy field
    await User.findByIdAndUpdate(refereeId, { referredBy: referrer._id });

    // Populate the response
    await newReferral.populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName");
    await newReferral.populate("referee", "nationalCredentials.firstName nationalCredentials.lastName");

    return NextResponse.json(
      {
        success: true,
        message: "Referral created successfully",
        data: newReferral,
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

// PUT - Update referral status
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

    // Only admins can update referral status
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

    const body: UpdateReferralBody = await request.json();
    const { id, ...updateData } = body;

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

    // Add completion/reward timestamps based on status
    const updateFields: any = { ...updateData };
    
    if (updateData.status === "completed" && !updateFields.completedAt) {
      updateFields.completedAt = new Date();
    }
    
    if (updateData.status === "rewarded" && !updateFields.rewardedAt) {
      updateFields.rewardedAt = new Date();
    }

    const updatedReferral = await Referral.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email")
      .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email");

    if (!updatedReferral) {
      return NextResponse.json(
        { success: false, message: "Referral not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral updated successfully",
      data: updatedReferral,
    });
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

// DELETE - Delete a referral
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

    // Only admins can delete referrals
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

    const deletedReferral = await Referral.findByIdAndDelete(id);

    if (!deletedReferral) {
      return NextResponse.json(
        { success: false, message: "Referral not found" },
        { status: 404 }
      );
    }

    // Optionally remove referredBy from the referee
    await User.findByIdAndUpdate(deletedReferral.referee, { referredBy: null });

    return NextResponse.json({
      success: true,
      message: "Referral deleted successfully",
      data: deletedReferral,
    });
  } catch (error: unknown) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
