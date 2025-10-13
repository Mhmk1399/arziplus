import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

// GET - Fetch contact information with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";
    const verificationStatus = searchParams.get("verification") || "";

    await connect();

    // Build query
    const query: any = {};

    // Check permissions - users can only see their own contact info, admins can see all
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");
    
    if (!isAdmin) {
      query._id = authUser.id;
    } else if (userId) {
      query._id = userId;
    }

    // Search by email, phone, or address
    if (search) {
      query.$or = [
        { "contactInfo.email": { $regex: search, $options: "i" } },
        { "contactInfo.mobilePhone": { $regex: search, $options: "i" } },
        { "contactInfo.homePhone": { $regex: search, $options: "i" } },
        { "contactInfo.address": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by verification status
    if (verificationStatus === "email_verified") {
      query["verifications.email.isVerified"] = true;
    } else if (verificationStatus === "phone_verified") {
      query["verifications.phone.isVerified"] = true;
    }

    // Only include users with contact info
    query["contactInfo.mobilePhone"] = { $exists: true, $ne: "" };

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select("contactInfo verifications.email verifications.phone nationalCredentials.firstName nationalCredentials.lastName createdAt updatedAt")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      contactData: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get contact info error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// POST - Create or update contact information
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const {
      userId,
      homePhone,
      mobilePhone,
      email,
      address,
      postalCode,
    } = await request.json();

    // Validate required fields
    if (!mobilePhone || !email) {
      return NextResponse.json(
        { error: "شماره موبایل و ایمیل الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate mobile phone format
    if (!/^09\d{9}$/.test(mobilePhone)) {
      return NextResponse.json(
        { error: "فرمت شماره موبایل صحیح نیست" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return NextResponse.json(
        { error: "فرمت ایمیل صحیح نیست" },
        { status: 400 }
      );
    }

    // Validate home phone format (optional)
    if (homePhone && !/^0\d{2,3}-?\d{7,8}$/.test(homePhone)) {
      return NextResponse.json(
        { error: "فرمت تلفن ثابت صحیح نیست" },
        { status: 400 }
      );
    }

    // Validate postal code format (optional)
    if (postalCode && !/^\d{10}$/.test(postalCode)) {
      return NextResponse.json(
        { error: "کد پستی باید 10 رقم باشد" },
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

    // Check for duplicate email (if different from current)
    if (email !== user.contactInfo?.email) {
      const existingEmail = await User.findOne({
        "contactInfo.email": email.toLowerCase(),
        _id: { $ne: targetUserId }
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "این ایمیل قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
    }

    // Check for duplicate mobile phone (if different from current)
    if (mobilePhone !== user.contactInfo?.mobilePhone) {
      const existingPhone = await User.findOne({
        "contactInfo.mobilePhone": mobilePhone,
        _id: { $ne: targetUserId }
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: "این شماره موبایل قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
    }

    // Prepare contact info update
    const contactInfo = {
      homePhone: homePhone?.trim() || "",
      mobilePhone: mobilePhone.trim(),
      email: email.toLowerCase().trim(),
      address: address?.trim() || "",
      postalCode: postalCode?.trim() || "",
      status: "pending_verification", // Default status for new/updated contact info
    };

    // Check if email or phone changed to reset verification
    const updateData: any = { contactInfo };

    if (email.toLowerCase() !== user.contactInfo?.email) {
      updateData["verifications.email.isVerified"] = false;
      updateData["$unset"] = { "verifications.email.verifiedAt": "" };
    }

    if (mobilePhone !== user.contactInfo?.mobilePhone) {
      updateData["verifications.phone.isVerified"] = false;
      updateData["$unset"] = { 
        ...updateData["$unset"],
        "verifications.phone.verifiedAt": "" 
      };
    }

    // Update contact info
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true, runValidators: true }
    ).select("contactInfo verifications.email verifications.phone");

    return NextResponse.json({
      message: "اطلاعات تماس با موفقیت به‌روزرسانی شد",
      contactInfo: updatedUser.contactInfo,
      verifications: {
        email: updatedUser.verifications.email,
        phone: updatedUser.verifications.phone,
      },
    });
  } catch (error) {
    console.error("Update contact info error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Update verification status for contact info
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { userId, verificationType, isVerified } = await request.json();

    if (!verificationType || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "نوع تایید و وضعیت الزامی هستند" },
        { status: 400 }
      );
    }

    const validTypes = ["email", "phone"];
    if (!validTypes.includes(verificationType)) {
      return NextResponse.json(
        { error: "نوع تایید نامعتبر" },
        { status: 400 }
      );
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");

    // Check permissions - admins can update any user, users can only verify their own
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    updateData[`verifications.${verificationType}.isVerified`] = isVerified;

    if (isVerified) {
      updateData[`verifications.${verificationType}.verifiedAt`] = new Date();
    } else {
      updateData["$unset"] = { [`verifications.${verificationType}.verifiedAt`]: "" };
    }

    // Update verification status
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true }
    ).select("verifications.email verifications.phone");

    return NextResponse.json({
      message: "وضعیت تایید با موفقیت به‌روزرسانی شد",
      verifications: {
        email: updatedUser.verifications.email,
        phone: updatedUser.verifications.phone,
      },
    });
  } catch (error) {
    console.error("Update contact verification error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Update contact info status (Admin only)
