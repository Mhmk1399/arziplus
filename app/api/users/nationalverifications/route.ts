import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

// GET - Fetch national credentials with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can view all users' credentials
    if (!authUser.roles.includes("admin") && !authUser.roles.includes("super_admin")) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const verificationStatus = searchParams.get("status") || "";
    const userId = searchParams.get("userId") || "";

    await connect();

    // Build query
    const query: any = {};

    // Filter by specific user
    if (userId) {
      query._id = userId;
    }

    // Search by name or national number
    if (search) {
      query.$or = [
        { "nationalCredentials.firstName": { $regex: search, $options: "i" } },
        { "nationalCredentials.lastName": { $regex: search, $options: "i" } },
        { "nationalCredentials.nationalNumber": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by verification status
    if (verificationStatus) {
      query["verifications.identity.status"] = verificationStatus;
    }

    // Only include users with national credentials
    query["nationalCredentials.firstName"] = { $exists: true, $ne: "" };

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select("nationalCredentials verifications.identity createdAt updatedAt")
        .sort({ "verifications.identity.submittedAt": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      credentials: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get national credentials error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// POST - Create or update national credentials
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const {
      userId,
      firstName,
      lastName,
      nationalNumber,
      nationalCardImageUrl,
      verificationImageUrl,
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !nationalNumber) {
      return NextResponse.json(
        { error: "نام، نام خانوادگی و کد ملی الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate national number format
    if (!/^\d{10}$/.test(nationalNumber)) {
      return NextResponse.json(
        { error: "کد ملی باید 10 رقم باشد" },
        { status: 400 }
      );
    }

    // Validate national number checksum
    const digits = nationalNumber.split('').map(Number);
    const checksum = digits.reduce((sum: number, digit: number, index: number) => {
      if (index < 9) return sum + digit * (10 - index);
      return sum;
    }, 0) % 11;

    const lastDigit = digits[9];
    const isValidNationalNumber = checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;

    if (!isValidNationalNumber) {
      return NextResponse.json(
        { error: "کد ملی معتبر نیست" },
        { status: 400 }
      );
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check if national number already exists (for other users)
    const existingUser = await User.findOne({
      "nationalCredentials.nationalNumber": nationalNumber,
      _id: { $ne: targetUserId }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این کد ملی قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    // Prepare update data
    const nationalCredentials = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalNumber,
      nationalCardImageUrl: nationalCardImageUrl || user.nationalCredentials?.nationalCardImageUrl || "",
      verificationImageUrl: verificationImageUrl || user.nationalCredentials?.verificationImageUrl || "",
    };

    // Update verification status
    const verificationUpdate: any = {
      "nationalCredentials": nationalCredentials,
      "verifications.identity.submittedAt": new Date(),
    };

    // If images are provided, set status to pending
    if (nationalCardImageUrl && verificationImageUrl) {
      verificationUpdate["verifications.identity.status"] = "pending";
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: verificationUpdate },
      { new: true, runValidators: true }
    ).select("nationalCredentials verifications.identity");

    return NextResponse.json({
      message: "اطلاعات هویتی با موفقیت ثبت شد",
      nationalCredentials: updatedUser.nationalCredentials,
      verificationStatus: updatedUser.verifications.identity,
    });
  } catch (error) {
    console.error("Create national credentials error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Update verification status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can update verification status
    if (!authUser.roles.includes("admin") && !authUser.roles.includes("super_admin")) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const { userId, status, rejectionReason } = await request.json();

    if (!userId || !status) {
      return NextResponse.json(
        { error: "شناسه کاربر و وضعیت الزامی هستند" },
        { status: 400 }
      );
    }

    const validStatuses = ["not_submitted", "pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { error: "دلیل رد الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      "verifications.identity.status": status,
      "verifications.identity.reviewedAt": new Date(),
      "verifications.identity.reviewedBy": authUser.id,
    };

    if (status === "rejected") {
      updateData["verifications.identity.rejectionReason"] = rejectionReason;
    } else {
      updateData["$unset"] = { "verifications.identity.rejectionReason": "" };
    }

    // Update user status based on verification
    if (status === "approved") {
      updateData.status = "active";
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("nationalCredentials verifications.identity status");

    return NextResponse.json({
      message: "وضعیت تایید با موفقیت به‌روزرسانی شد",
      verificationStatus: updatedUser.verifications.identity,
      userStatus: updatedUser.status,
    });
  } catch (error) {
    console.error("Update verification status error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}