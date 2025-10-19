import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { sendVerificationCode, generateVerificationCode } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    // Validate phone number format
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "فرمت شماره تلفن صحیح نیست" },
        { status: 400 }
      );
    }

    await connect();

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Check if user exists
    let user = await User.findOne({ 'contactInfo.mobilePhone': phone });
    
    if (user) {
      // Update existing user's verification code
      user.verifications.phone.verificationCode = verificationCode;
      user.verifications.phone.verificationCodeExpires = expiresAt;
      user.verifications.phone.isVerified = false;
      await user.save();
    } else {
      // Create new user with phone number only
      const username = `user_${phone.slice(-8)}`;
      const tempEmail = `${phone}@temp.arziPlus.com`;
      
      user = await User.create({
        username,
        contactInfo: {
          mobilePhone: phone,
          email: tempEmail
        },
        verifications: {
          phone: {
            verificationCode,
            verificationCodeExpires: expiresAt,
            isVerified: false
          },
          email: {
            isVerified: false
          }
        },
        status: 'pending_verification'
      });
    }

    // Send SMS
    const smsSent = await sendVerificationCode(phone, verificationCode);
    
    if (!smsSent) {
      return NextResponse.json(
        { error: "خطا در ارسال پیامک" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "کد تایید به شماره شما ارسال شد",
      userId: user._id.toString(),
      isExistingUser: !!user.nationalCredentials?.firstName
    });

  } catch (error) {
    console.log('SMS send error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}