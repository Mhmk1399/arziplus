import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

interface updateData {
  [key: string]: string;
}
interface banckinfo {
  _id?: string;
  cardNumber: number;
  shebaNumber: number;
}
interface query {
  _id?: string;
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  "bankingInfo.0"?: { $exists: boolean };
}

// GET - Fetch banking information with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }
    console.log(authUser);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";

    await connect();

    // Build query
    const query: query = {};

    // Check permissions - users can only see their own banking info, admins can see all
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    if (!isAdmin) {
      query._id = authUser.id;
    } else if (userId) {
      query._id = userId;
    }

    // Search by account holder name, bank name, or card number
    if (search) {
      query.$or = [
        { "bankingInfo.accountHolderName": { $regex: search, $options: "i" } },
        { "bankingInfo.bankName": { $regex: search, $options: "i" } },
        { "bankingInfo.cardNumber": { $regex: search, $options: "i" } },
        { "bankingInfo.shebaNumber": { $regex: search, $options: "i" } },
      ];
    }

    // Only include users with banking info
    query["bankingInfo.0"] = { $exists: true };

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select(
          "bankingInfo nationalCredentials.firstName nationalCredentials.lastName createdAt updatedAt"
        )
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      bankingData: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.log("Get banking info error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// POST - Add new banking information
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { userId, bankName, cardNumber, shebaNumber, accountHolderName } =
      await request.json();

    // Validate required fields
    if (!bankName || !cardNumber || !shebaNumber || !accountHolderName) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate card number
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      return NextResponse.json(
        { error: "شماره کارت باید 16 رقم باشد" },
        { status: 400 }
      );
    }

    // Validate SHEBA number
    if (!/^IR\d{24}$/.test(shebaNumber)) {
      return NextResponse.json(
        { error: "فرمت شماره شبا صحیح نیست (IR + 24 رقم)" },
        { status: 400 }
      );
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check for duplicate card number or SHEBA number
    const existingCard = await User.findOne({
      "bankingInfo.cardNumber": cleanCardNumber,
      _id: { $ne: targetUserId },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: "این شماره کارت قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    const existingSheba = await User.findOne({
      "bankingInfo.shebaNumber": shebaNumber,
      _id: { $ne: targetUserId },
    });

    if (existingSheba) {
      return NextResponse.json(
        { error: "این شماره شبا قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    // Check if user already has this bank account
    const hasDuplicateInUser = user.bankingInfo.some(
      (bank: banckinfo) =>
        bank.cardNumber === cleanCardNumber || bank.shebaNumber === shebaNumber
    );

    if (hasDuplicateInUser) {
      return NextResponse.json(
        { error: "این حساب بانکی قبلاً اضافه شده است" },
        { status: 400 }
      );
    }

    // Create new banking info
    const newBankingInfo = {
      bankName: bankName.trim(),
      cardNumber: cleanCardNumber,
      shebaNumber: shebaNumber.toUpperCase(),
      accountHolderName: accountHolderName.trim(),
      status: "pending_verification", // Default status for new submissions
    };

    // Add to user's banking info array
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $push: { bankingInfo: newBankingInfo } },
      { new: true, runValidators: true }
    ).select("bankingInfo");

    return NextResponse.json({
      message: "اطلاعات بانکی با موفقیت اضافه شد",
      bankingInfo: updatedUser.bankingInfo,
    });
  } catch (error) {
    console.log("Add banking info error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Update existing banking information
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const {
      userId,
      bankingInfoId,
      bankName,
      cardNumber,
      shebaNumber,
      accountHolderName,
      status,
      rejectionNotes,
    } = await request.json();

    if (!bankingInfoId) {
      return NextResponse.json(
        { error: "شناسه اطلاعات بانکی الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Find user and banking info
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const bankingInfoIndex = user.bankingInfo.findIndex(
      (bank: banckinfo) => bank._id?.toString() === bankingInfoId
    );

    if (bankingInfoIndex === -1) {
      return NextResponse.json(
        { error: "اطلاعات بانکی یافت نشد" },
        { status: 404 }
      );
    }

    // Validate updates
    const updateData: updateData = {};

    if (bankName)
      updateData[`bankingInfo.${bankingInfoIndex}.bankName`] = bankName.trim();
    if (accountHolderName)
      updateData[`bankingInfo.${bankingInfoIndex}.accountHolderName`] =
        accountHolderName.trim();

    // Admin-only status updates
    if (status && isAdmin) {
      if (!["accepted", "rejected", "pending_verification"].includes(status)) {
        return NextResponse.json(
          { error: "وضعیت نامعتبر است" },
          { status: 400 }
        );
      }
      updateData[`bankingInfo.${bankingInfoIndex}.status`] = status;

      // Add rejection notes if status is rejected
      if (status === "rejected" && rejectionNotes) {
        updateData[`bankingInfo.${bankingInfoIndex}.rejectionNotes`] =
          rejectionNotes.trim();
      } else if (status !== "rejected") {
        // Clear rejection notes if status is not rejected
        updateData[`bankingInfo.${bankingInfoIndex}.rejectionNotes`] = "";
      }
    }

    if (cardNumber) {
      const cleanCardNumber = cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCardNumber)) {
        return NextResponse.json(
          { error: "شماره کارت باید 16 رقم باشد" },
          { status: 400 }
        );
      }

      // Check for duplicates
      const existingCard = await User.findOne({
        "bankingInfo.cardNumber": cleanCardNumber,
        $or: [
          { _id: { $ne: targetUserId } },
          {
            _id: targetUserId,
            "bankingInfo._id": {
              $ne: new mongoose.Types.ObjectId(bankingInfoId),
            },
          },
        ],
      });

      if (existingCard) {
        return NextResponse.json(
          { error: "این شماره کارت قبلاً ثبت شده است" },
          { status: 400 }
        );
      }

      updateData[`bankingInfo.${bankingInfoIndex}.cardNumber`] =
        cleanCardNumber;
    }

    if (shebaNumber) {
      if (!/^IR\d{24}$/.test(shebaNumber)) {
        return NextResponse.json(
          { error: "فرمت شماره شبا صحیح نیست (IR + 24 رقم)" },
          { status: 400 }
        );
      }

      // Check for duplicates
      const existingSheba = await User.findOne({
        "bankingInfo.shebaNumber": shebaNumber,
        $or: [
          { _id: { $ne: targetUserId } },
          {
            _id: targetUserId,
            "bankingInfo._id": {
              $ne: new mongoose.Types.ObjectId(bankingInfoId),
            },
          },
        ],
      });

      if (existingSheba) {
        return NextResponse.json(
          { error: "این شماره شبا قبلاً ثبت شده است" },
          { status: 400 }
        );
      }

      updateData[`bankingInfo.${bankingInfoIndex}.shebaNumber`] =
        shebaNumber.toUpperCase();
    }

    // Update banking info
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("bankingInfo");

    return NextResponse.json({
      message: "اطلاعات بانکی با موفقیت به‌روزرسانی شد",
      bankingInfo: updatedUser.bankingInfo,
    });
  } catch (error) {
    console.log("Update banking info error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// DELETE - Remove banking information
export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bankingInfoId = searchParams.get("bankingInfoId");

    if (!bankingInfoId) {
      return NextResponse.json(
        { error: "شناسه اطلاعات بانکی الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Remove banking info
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { bankingInfo: { _id: bankingInfoId } } },
      { new: true }
    ).select("bankingInfo");

    if (!updatedUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      message: "اطلاعات بانکی با موفقیت حذف شد",
      bankingInfo: updatedUser.bankingInfo,
    });
  } catch (error) {
    console.log("Delete banking info error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
