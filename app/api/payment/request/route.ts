import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import { getAuthUser } from "@/lib/auth";
import { ZarinPal } from "@/lib/zarinpal";

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز - لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const { amount, description, serviceId, orderId, currency = 'IRR' } = await request.json();

    // Validation
    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: "مبلغ باید حداقل ۱۰۰۰ ریال باشد" },
        { status: 400 }
      );
    }

    if (!description || description.length > 255) {
      return NextResponse.json(
        { error: "توضیحات الزامی است و حداکثر ۲۵۵ کاراکتر" },
        { status: 400 }
      );
    }

    await connect();

    // Check for recent duplicate payments (within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicatePayment = await Payment.findOne({
      userId: authUser.id,
      amount,
      description,
      currency,
      createdAt: { $gte: fiveMinutesAgo },
      status: { $in: ['pending', 'verified'] }
    });

    if (duplicatePayment) {
      // If payment is already verified, redirect to success
      if (duplicatePayment.status === 'verified') {
        return NextResponse.json({
          success: true,
          message: "پرداخت قبلاً انجام شده است",
          data: {
            paymentId: duplicatePayment._id,
            authority: duplicatePayment.authority,
            paymentUrl: null, // No redirect needed
            amount: duplicatePayment.amount,
            description: duplicatePayment.description,
            duplicate: true,
            redirectTo: `/payment/success?Authority=${duplicatePayment.authority}&Status=OK&duplicate=true`
          },
        });
      }
      
      // If payment is pending, return the existing payment URL
      if (duplicatePayment.authority) {
        const paymentUrl = ZarinPal.getPaymentUrl(duplicatePayment.authority);
        return NextResponse.json({
          success: true,
          message: "درخواست پرداخت قبلاً ایجاد شده است",
          data: {
            paymentId: duplicatePayment._id,
            authority: duplicatePayment.authority,
            paymentUrl,
            amount: duplicatePayment.amount,
            description: duplicatePayment.description,
            duplicate: true
          },
        });
      }
    }

    // Create payment record in database
    const payment = new Payment({
      userId: authUser.id,
      amount,
      description,
      currency,
      serviceId,
      orderId,
      status: 'pending',
      metadata: {
        mobile: authUser.phone,
        order_id: orderId,
      },
    });

    await payment.save();

    // Prepare callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payment/callback`;

    // Request payment from ZarinPal
    const zarinpalResponse = await ZarinPal.requestPayment({
      amount,
      description,
      callback_url: callbackUrl,
      currency,
      metadata: {
        mobile: authUser.phone,
        order_id: payment._id.toString(),
      },
    });

    if (zarinpalResponse.data.code === 100) {
      // Update payment with authority
      payment.authority = zarinpalResponse.data.authority;
      payment.zarinpalCode = zarinpalResponse.data.code;
      payment.zarinpalMessage = zarinpalResponse.data.message;
      payment.feeType = zarinpalResponse.data.fee_type;
      payment.fee = zarinpalResponse.data.fee;
      
      await payment.save();

      // Return payment URL
      const paymentUrl = ZarinPal.getPaymentUrl(zarinpalResponse.data.authority);

      return NextResponse.json({
        success: true,
        message: "درخواست پرداخت با موفقیت ایجاد شد",
        data: {
          paymentId: payment._id,
          authority: zarinpalResponse.data.authority,
          paymentUrl,
          amount,
          description,
        },
      });
    } else {
      // Update payment status to failed
      payment.status = 'failed';
      payment.zarinpalCode = zarinpalResponse.data.code;
      payment.zarinpalMessage = zarinpalResponse.data.message;
      await payment.save();

      return NextResponse.json(
        { 
          error: "خطا در ایجاد درخواست پرداخت",
          message: ZarinPal.getStatusMessage(zarinpalResponse.data.code),
          code: zarinpalResponse.data.code,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      { error: "خطای سرور در ایجاد درخواست پرداخت" },
      { status: 500 }
    );
  }
}