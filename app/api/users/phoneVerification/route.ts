import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import { sendVerificationCode } from "@/lib/sms";

// POST - Send phone verification code
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { phone, userId } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "شماره تلفن الزامی است" },
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

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Find user
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check if phone matches user's phone
    if (user.contactInfo?.mobilePhone !== phone) {
      return NextResponse.json(
        { error: "شماره تلفن با اطلاعات کاربر مطابقت ندارد" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.verifications?.phone?.isVerified) {
      return NextResponse.json(
        { error: "شماره تلفن قبلاً تایید شده است" },
        { status: 400 }
      );
    }

    // Check rate limiting (prevent too many requests)
    const lastSent = user.verifications?.phone?.lastCodeSent;
    if (lastSent && new Date().getTime() - new Date(lastSent).getTime() < 60000) { // 1 minute
      return NextResponse.json(
        { error: "لطفاً یک دقیقه صبر کنید" },
        { status: 429 }
      );
    }

    // Generate verification code (5-digit for SMS)
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with verification code
    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        "verifications.phone.verificationCode": verificationCode,
        "verifications.phone.verificationCodeExpires": expiresAt,
        "verifications.phone.lastCodeSent": new Date(),
      }
    });

    // Send SMS
    try {
      await sendVerificationCode(phone, verificationCode);

      return NextResponse.json({
        message: "کد تایید به شماره تلفن شما ارسال شد",
        expiresAt: expiresAt.toISOString(),
      });
    } catch (smsError) {
      console.log("SMS send error:", smsError);
      return NextResponse.json(
        { error: "خطا در ارسال پیامک" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("Send phone verification error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Verify phone with code
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { phone, code, userId } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "شماره تلفن و کد تایید الزامی هستند" },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(code)) {
      return NextResponse.json(
        { error: "کد تایید باید 5 رقم باشد" },
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

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Find user
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check if phone matches
    if (user.contactInfo?.mobilePhone !== phone) {
      return NextResponse.json(
        { error: "شماره تلفن با اطلاعات کاربر مطابقت ندارد" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.verifications?.phone?.isVerified) {
      return NextResponse.json(
        { error: "شماره تلفن قبلاً تایید شده است" },
        { status: 400 }
      );
    }

    // Check verification code
    const storedCode = user.verifications?.phone?.verificationCode;
    const codeExpires = user.verifications?.phone?.verificationCodeExpires;

    if (!storedCode) {
      return NextResponse.json(
        { error: "کد تایید یافت نشد. لطفاً مجدداً درخواست دهید" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(codeExpires)) {
      return NextResponse.json(
        { error: "کد تایید منقضی شده است" },
        { status: 400 }
      );
    }

    if (storedCode !== code) {
      // Increment failed attempts
      await User.findByIdAndUpdate(targetUserId, {
        $inc: { "verifications.phone.failedAttempts": 1 }
      });

      // Check if too many failed attempts (optional security feature)
      const failedAttempts = (user.verifications?.phone?.failedAttempts || 0) + 1;
      if (failedAttempts >= 5) {
        await User.findByIdAndUpdate(targetUserId, {
          $unset: {
            "verifications.phone.verificationCode": "",
            "verifications.phone.verificationCodeExpires": "",
          },
          $set: {
            "verifications.phone.blockedUntil": new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
          }
        });

        return NextResponse.json(
          { error: "تعداد تلاش‌های نادرست زیاد است. لطفاً 30 دقیقه صبر کنید" },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "کد تایید نادرست است" },
        { status: 400 }
      );
    }

    // Check if blocked
    const blockedUntil = user.verifications?.phone?.blockedUntil;
    if (blockedUntil && new Date() < new Date(blockedUntil)) {
      return NextResponse.json(
        { error: "حساب شما موقتاً مسدود است" },
        { status: 429 }
      );
    }

    // Verify phone
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      {
        $set: {
          "verifications.phone.isVerified": true,
          "verifications.phone.verifiedAt": new Date(),
        },
        $unset: {
          "verifications.phone.verificationCode": "",
          "verifications.phone.verificationCodeExpires": "",
          "verifications.phone.failedAttempts": "",
          "verifications.phone.blockedUntil": "",
          "verifications.phone.lastCodeSent": "",
        }
      },
      { new: true }
    ).select("verifications.phone contactInfo.mobilePhone");

    return NextResponse.json({
      message: "شماره تلفن با موفقیت تایید شد",
      phoneVerification: updatedUser.verifications.phone,
    });
  } catch (error) {
    console.log("Verify phone error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// GET - Check phone verification status
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin = authUser.roles.includes("admin") || authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Find user
    const user = await User.findById(targetUserId)
      .select("verifications.phone contactInfo.mobilePhone")
      .lean();

    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const phoneVerification = user.verifications?.phone || {};

    return NextResponse.json({
      phone: user.contactInfo?.mobilePhone,
      isVerified: phoneVerification.isVerified || false,
      verifiedAt: phoneVerification.verifiedAt,
      hasVerificationPending: !!phoneVerification.verificationCode,
      codeExpires: phoneVerification.verificationCodeExpires,
      isBlocked: phoneVerification.blockedUntil && new Date() < new Date(phoneVerification.blockedUntil),
      canRequestNewCode: !phoneVerification.lastCodeSent || 
        new Date().getTime() - new Date(phoneVerification.lastCodeSent).getTime() >= 60000,
    });
  } catch (error) {
    console.log("Get phone verification status error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}