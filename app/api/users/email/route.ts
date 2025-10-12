import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import crypto from "crypto";

// POST - Send email verification code
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { email, userId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "ایمیل الزامی است" },
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

    // Check if email matches user's email
    if (user.contactInfo?.email !== email) {
      return NextResponse.json(
        { error: "ایمیل با اطلاعات کاربر مطابقت ندارد" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.verifications?.email?.isVerified) {
      return NextResponse.json(
        { error: "ایمیل قبلاً تایید شده است" },
        { status: 400 }
      );
    }

    // Generate verification code (6-digit)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with verification code
    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        "verifications.email.verificationCode": verificationCode,
        "verifications.email.verificationToken": verificationToken,
        "verifications.email.verificationCodeExpires": expiresAt,
      }
    });

    // Send email (you'll need to implement sendEmail function)
    try {
      // For now, we'll just log the code - implement actual email sending
      console.log(`Email verification code for ${email}: ${verificationCode}`);
      
      // Uncomment when you implement sendEmail
      // await sendEmail({
      //   to: email,
      //   subject: "کد تایید ایمیل - آرزی پلاس",
      //   html: `
      //     <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      //       <h2 style="color: #4F46E5; text-align: center;">کد تایید ایمیل</h2>
      //       <p>سلام،</p>
      //       <p>کد تایید ایمیل شما:</p>
      //       <div style="background: #F3F4F6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
      //         ${verificationCode}
      //       </div>
      //       <p>این کد تا 15 دقیقه دیگر معتبر است.</p>
      //       <p>با تشکر،<br>تیم آرزی پلاس</p>
      //     </div>
      //   `
      // });

      return NextResponse.json({
        message: "کد تایید به ایمیل شما ارسال شد",
        expiresAt: expiresAt.toISOString(),
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return NextResponse.json(
        { error: "خطا در ارسال ایمیل" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send email verification error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH - Verify email with code
export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { email, code, userId } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "ایمیل و کد تایید الزامی هستند" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "کد تایید باید 6 رقم باشد" },
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

    // Check if email matches
    if (user.contactInfo?.email !== email) {
      return NextResponse.json(
        { error: "ایمیل با اطلاعات کاربر مطابقت ندارد" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.verifications?.email?.isVerified) {
      return NextResponse.json(
        { error: "ایمیل قبلاً تایید شده است" },
        { status: 400 }
      );
    }

    // Check verification code
    const storedCode = user.verifications?.email?.verificationCode;
    const codeExpires = user.verifications?.email?.verificationCodeExpires;

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
      // Increment failed attempts (optional security feature)
      await User.findByIdAndUpdate(targetUserId, {
        $inc: { "verifications.email.failedAttempts": 1 }
      });

      return NextResponse.json(
        { error: "کد تایید نادرست است" },
        { status: 400 }
      );
    }

    // Verify email
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      {
        $set: {
          "verifications.email.isVerified": true,
          "verifications.email.verifiedAt": new Date(),
        },
        $unset: {
          "verifications.email.verificationCode": "",
          "verifications.email.verificationToken": "",
          "verifications.email.verificationCodeExpires": "",
          "verifications.email.failedAttempts": "",
        }
      },
      { new: true }
    ).select("verifications.email contactInfo.email");

    return NextResponse.json({
      message: "ایمیل با موفقیت تایید شد",
      emailVerification: updatedUser.verifications.email,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// GET - Check email verification status
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
      .select("verifications.email contactInfo.email")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      email: user.contactInfo?.email,
      isVerified: user.verifications?.email?.isVerified || false,
      verifiedAt: user.verifications?.email?.verifiedAt,
      hasVerificationPending: !!user.verifications?.email?.verificationCode,
      codeExpires: user.verifications?.email?.verificationCodeExpires,
    });
  } catch (error) {
    console.error("Get email verification status error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}