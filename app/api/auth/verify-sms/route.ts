import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone, code, userId } = await request.json();

    if (!phone || !code || !userId) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "فرمت شماره تلفن صحیح نیست" },
        { status: 400 }
      );
    }

    await connect();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Verify phone matches
    if (user.contactInfo.mobilePhone !== phone) {
      return NextResponse.json(
        { error: "شماره تلفن مطابقت ندارد" },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (!user.verifications.phone.verificationCodeExpires || 
        new Date() > user.verifications.phone.verificationCodeExpires) {
      return NextResponse.json(
        { error: "کد تایید منقضی شده است" },
        { status: 400 }
      );
    }

    // Verify code
    if (user.verifications.phone.verificationCode !== code) {
      return NextResponse.json(
        { error: "کد تایید اشتباه است" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.verifications.phone.isVerified = true;
    user.verifications.phone.verifiedAt = new Date();
    user.verifications.phone.verificationCode = undefined;
    user.verifications.phone.verificationCodeExpires = undefined;
    user.status = 'active';
    
    await user.save();

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.contactInfo.email,
      roles: user.roles,
      firstName: user.nationalCredentials?.firstName,
      lastName: user.nationalCredentials?.lastName,
      phone: user.contactInfo.mobilePhone
    });

    // Check if user has complete profile (firstName exists)
    const isCompleteProfile = !!(user.nationalCredentials?.firstName);
    
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      message: "شماره تلفن با موفقیت تایید شد",
      token,
      user: userWithoutPassword,
      isCompleteProfile,
      redirectTo: isCompleteProfile ? '/admin' : '/complete-profile'
    });

  } catch (error) {
    console.error('SMS verification error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}