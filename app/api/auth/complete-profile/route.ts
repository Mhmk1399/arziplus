import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز" },
        { status: 401 }
      );
    }

    const { firstName, lastName, email, nationalNumber } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "نام و نام خانوادگی الزامی است" },
        { status: 400 }
      );
    }

    // Validate national number if provided
    if (nationalNumber && !/^\d{10}$/.test(nationalNumber)) {
      return NextResponse.json(
        { error: "کد ملی باید ۱۰ رقم باشد" },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return NextResponse.json(
        { error: "فرمت ایمیل صحیح نیست" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Check if national number already exists (if provided)
    if (nationalNumber) {
      const existingNational = await User.findOne({ 
        'nationalCredentials.nationalNumber': nationalNumber,
        _id: { $ne: user._id }
      });
      if (existingNational) {
        return NextResponse.json(
          { error: "این کد ملی قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
    }

    // Check if email already exists (if provided and different from temp email)
    if (email && !email.includes('@temp.')) {
      const existingEmail = await User.findOne({ 
        'contactInfo.email': email,
        _id: { $ne: user._id }
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "این ایمیل قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    user.nationalCredentials = user.nationalCredentials || {};
    user.nationalCredentials.firstName = firstName;
    user.nationalCredentials.lastName = lastName;
    
    if (nationalNumber) {
      user.nationalCredentials.nationalNumber = nationalNumber;
    }

    if (email && !email.includes('@temp.')) {
      user.contactInfo.email = email;
      user.verifications.email.isVerified = false; // Need to verify new email
    }

    await user.save();

    const { password:_, ...userWithoutPassword } = user.toObject();
console.log(_)
    return NextResponse.json({
      message: "پروفایل با موفقیت به‌روزرسانی شد",
      user: userWithoutPassword
    });

  } catch (error) {
    console.log('Complete profile error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}