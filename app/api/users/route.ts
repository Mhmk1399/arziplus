import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// GET - Fetch users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can view all users
    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const role = searchParams.get("role") || "";
    const verificationStatus = searchParams.get("verification") || "";

    await connect();

    // Build query
    const query: any = {};

    // Search by name, email, phone, or username
    if (search) {
      query.$or = [
        { "nationalCredentials.firstName": { $regex: search, $options: "i" } },
        { "nationalCredentials.lastName": { $regex: search, $options: "i" } },
        { "contactInfo.email": { $regex: search, $options: "i" } },
        { "contactInfo.mobilePhone": { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by role
    if (role) {
      query.roles = { $in: [role] };
    }

    // Filter by verification status
    if (verificationStatus === "email_verified") {
      query["verifications.email.isVerified"] = true;
    } else if (verificationStatus === "phone_verified") {
      query["verifications.phone.isVerified"] = true;
    } else if (verificationStatus === "identity_approved") {
      query["verifications.identity.status"] = "approved";
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Update user security settings (username, password, roles, status)
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { userId, username, password, roles, status } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check permissions - users can only update their own data, admins can update others
    const isOwnProfile = authUser.id === userId;
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};

    // Username validation and update
    if (username) {
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
        return NextResponse.json(
          { error: "نام کاربری باید 3-30 کاراکتر و شامل حروف، اعداد و _ باشد" },
          { status: 400 }
        );
      }

      // Check if username already exists
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "نام کاربری قبلاً استفاده شده است" },
          { status: 400 }
        );
      }

      updateData.username = username;
    }

    // Password validation and hashing
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "رمز عبور باید حداقل 6 کاراکتر باشد" },
          { status: 400 }
        );
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return NextResponse.json(
          { error: "رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد" },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Roles update (only admins can change roles)
    if (roles && isAdmin) {
      const validRoles = [
        "user",
        "admin",
        "super_admin",
        "moderator",
        "support",
      ];
      const invalidRoles = roles.filter(
        (role: string) => !validRoles.includes(role)
      );

      if (invalidRoles.length > 0) {
        return NextResponse.json(
          { error: `نقش‌های نامعتبر: ${invalidRoles.join(", ")}` },
          { status: 400 }
        );
      }

      if (roles.length === 0) {
        return NextResponse.json(
          { error: "حداقل یک نقش باید انتخاب شود" },
          { status: 400 }
        );
      }

      updateData.roles = roles;
    }

    // Status update (only admins can change status)
    if (status && isAdmin) {
      const validStatuses = [
        "active",
        "suspended",
        "banned",
        "pending_verification",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
      }

      updateData.status = status;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      message: "اطلاعات با موفقیت به‌روزرسانی شد",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// DELETE - Delete user (only admins)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can delete users
    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Prevent deleting super_admin users
    if (user.roles.includes("super_admin")) {
      return NextResponse.json(
        { error: "نمی‌توان مدیر کل را حذف کرد" },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (authUser.id === userId) {
      return NextResponse.json(
        { error: "نمی‌توان خود را حذف کرد" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "کاربر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
