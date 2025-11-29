import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

/**
 * POST /api/verification/complete-profile
 * Completes user profile with verified national credentials
 * Sets phone verification to true and nationalCredentials status to accepted
 */
export async function POST(request: NextRequest) {
  try {
    // Extract user from JWT token
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const { firstName, lastName, nationalNumber, phoneNumber } =
      await request.json();

    // Validate input
    if (!firstName || !lastName || !nationalNumber || !phoneNumber) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate firstName
    if (firstName.trim().length < 2) {
      return NextResponse.json(
        { error: "نام باید حداقل 2 کاراکتر باشد" },
        { status: 400 }
      );
    }

    // Validate lastName
    if (lastName.trim().length < 2) {
      return NextResponse.json(
        { error: "نام خانوادگی باید حداقل 2 کاراکتر باشد" },
        { status: 400 }
      );
    }

    // Validate national code format (10 digits)
    if (!/^\d{10}$/.test(nationalNumber)) {
      return NextResponse.json(
        { error: "فرمت کد ملی صحیح نیست" },
        { status: 400 }
      );
    }

    // Validate mobile format (09xxxxxxxxx)
    if (!/^09\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "فرمت شماره موبایل صحیح نیست" },
        { status: 400 }
      );
    }

    await connect();

    // Find user
    const dbUser = await User.findById(user.id);

    if (!dbUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check if national number is already used by another user
    const existingUser = await User.findOne({
      "nationalCredentials.nationalNumber": nationalNumber,
      _id: { $ne: user.id },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این کد ملی قبلا ثبت شده است" },
        { status: 400 }
      );
    }

    console.log("📝 Updating user profile:", {
      userId: user.id,
      firstName,
      lastName,
      nationalNumber,
      phoneNumber,
    });

    // Update user with verified credentials
    dbUser.nationalCredentials = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalNumber: nationalNumber,
      status: "accepted", // Automatically accept since Shahkar verified
      nationalCardImageUrl: dbUser.nationalCredentials?.nationalCardImageUrl || "",
      verificationImageUrl: dbUser.nationalCredentials?.verificationImageUrl || "",
    };

    // Mark phone as verified
    dbUser.verifications.phone.isVerified = true;
    dbUser.verifications.phone.verifiedAt = new Date();

    // Update contact info if needed
    if (!dbUser.contactInfo) {
      dbUser.contactInfo = {
        mobilePhone: phoneNumber,
      };
    } else if (dbUser.contactInfo.mobilePhone !== phoneNumber) {
      dbUser.contactInfo.mobilePhone = phoneNumber;
    }

    // Set user status to active
    dbUser.status = "active";

    await dbUser.save();

    console.log("✅ User profile updated successfully");

    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = dbUser.toObject();
console.log(_)
    return NextResponse.json({
      message: "اطلاعات با موفقیت ثبت شد",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("❌ Complete profile error:", error);

    // Handle duplicate key error for national number
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: "این کد ملی قبلا ثبت شده است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "خطا در ثبت اطلاعات" },
      { status: 500 }
    );
  }
}
