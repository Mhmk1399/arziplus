import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/lib/data";
import User from "@/models/users";
import Verification from "@/models/verification";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "شماره تلفن و رمز عبور الزامی است" },
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
      return NextResponse.json({ 
        error: 'شماره تلفن تایید نشده است. لطفاً ابتدا شماره خود را تایید کنید.' 
      }, { status: 400 });
    }
    
    // Find user by mobile phone
    const user = await User.findOne({ 'contactInfo.mobilePhone': phone });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این شماره تلفن یافت نشد" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isAccountLocked) {
      return NextResponse.json(
        { error: "حساب کاربری قفل شده است. لطفاً بعداً تلاش کنید." },
        { status: 423 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      user.security.loginAttempts = (user.security.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (user.security.loginAttempts >= 5) {
        user.security.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      
      await user.save();
      
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    user.security.loginAttempts = 0;
    user.security.lockUntil = undefined;
    user.security.lastLogin = new Date();
    
    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      email: user.contactInfo.email,
      roles: user.roles,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" + error },
      { status: 500 }
    );
  }
}
