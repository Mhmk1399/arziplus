import { NextRequest, NextResponse } from "next/server";
import { verifyNationalCodeWithMobile } from "@/lib/nationalValidataion";

/**
 * POST /api/verification/shahkar-verify
 * Verifies if national code matches with mobile number using Shahkar API
 */
export async function POST(request: NextRequest) {
  try {
    const { nationalCode, phoneNumber } = await request.json();

    // Validate input
    if (!nationalCode || !phoneNumber) {
      return NextResponse.json(
        { error: "کد ملی و شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    // Validate national code format (10 digits)
    if (!/^\d{10}$/.test(nationalCode)) {
      return NextResponse.json(
        { error: "فرمت کد ملی صحیح نیست. باید 10 رقم باشد" },
        { status: 400 }
      );
    }

    // Validate mobile format (09xxxxxxxxx)
    if (!/^09\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "فرمت شماره موبایل صحیح نیست. باید با 09 شروع شود" },
        { status: 400 }
      );
    }

    console.log("🔍 Shahkar API Request:", {
      nationalCode,
      phoneNumber,
      timestamp: new Date().toISOString(),
    });

    // Call Shahkar verification service
    const isVerified = await verifyNationalCodeWithMobile(
      nationalCode,
      phoneNumber
    );

    if (isVerified) {
      console.log("✅ Shahkar verification successful");
      return NextResponse.json({
        verified: true,
        message: "کد ملی و شماره موبایل با هم مطابقت دارند",
      });
    } else {
      console.log("❌ Shahkar verification failed");
      return NextResponse.json(
        {
          verified: false,
          error: "کد ملی و شماره موبایل با هم مطابقت ندارند",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Shahkar API error:", error);
    return NextResponse.json(
      { error: "خطا در تایید اطلاعات. لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
