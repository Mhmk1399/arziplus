import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/lib/data";
import User from "@/models/users";
import Verification from "@/models/verification";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, password, phone, email } = await request.json();

    if (!firstName || !lastName || !password || !phone) {
      return NextResponse.json(
        { error: "نام، نام خانوادگی، رمز عبور و شماره تلفن الزامی است" },
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

    // Check if phone is verified
    const verification = await Verification.findOne({ phone, verified: true });
    if (!verification) {
      return NextResponse.json(
        { error: "شماره تلفن تایید نشده است" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 'contactInfo.mobilePhone': phone });
    if (existingUser) {
      return NextResponse.json(
        { error: "کاربر با این شماره تلفن قبلاً ثبت نام کرده است" },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ 'contactInfo.email': email });
      if (existingEmail) {
        return NextResponse.json(
          { error: "کاربر با این ایمیل قبلاً ثبت نام کرده است" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate username from phone or firstName
    const username = `user_${phone.slice(-8)}`;
    
    // Use provided email or generate temporary one
    const userEmail = email || `${phone}@temp.arziplus.com`;

    const user = await User.create({
      username,
      password: hashedPassword,
      nationalCredentials: {
        firstName,
        lastName
      },
      contactInfo: {
        mobilePhone: phone,
        email: userEmail
      },
      verifications: {
        phone: {
          isVerified: true,
          verifiedAt: new Date()
        },
        email: {
          isVerified: !!email // Mark as verified if email was provided during registration
        }
      },
      status: email ? 'active' : 'pending_verification', // Active if email provided, otherwise pending
      roles: ['user']
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.contactInfo.email,
      roles: user.roles,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    console.log(_);
    return NextResponse.json(
      {
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
