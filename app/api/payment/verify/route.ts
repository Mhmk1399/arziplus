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

    const { authority, amount } = await request.json();

    if (!authority || !amount) {
      return NextResponse.json(
        { error: "پارامترهای مورد نیاز ارسال نشده" },
        { status: 400 }
      );
    }

    await connect();

    // Find payment by authority and user
    const payment = await Payment.findOne({ 
      authority, 
      userId: authUser.id 
    });

    if (!payment) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (payment.status === 'verified') {
      return NextResponse.json({
        success: true,
        message: "تراکنش قبلاً تایید شده است",
        data: {
          paymentId: payment._id,
          refId: payment.refId,
          amount: payment.amount,
          status: payment.status,
          cardPan: payment.cardPan,
        },
      });
    }

    // Verify with ZarinPal
    const verifyResponse = await ZarinPal.verifyPayment({
      amount: payment.amount,
      authority,
    });

    // Update payment record
    payment.zarinpalCode = verifyResponse.data.code;
    payment.zarinpalMessage = verifyResponse.data.message;

    if (verifyResponse.data.code === 100) {
      // Successful verification
      payment.status = 'verified';
      payment.refId = verifyResponse.data.ref_id;
      payment.cardPan = verifyResponse.data.card_pan;
      payment.cardHash = verifyResponse.data.card_hash;
      payment.feeType = verifyResponse.data.fee_type;
      payment.fee = verifyResponse.data.fee;
      payment.verifiedAt = new Date();
      payment.paidAt = new Date();

      await payment.save();

      return NextResponse.json({
        success: true,
        message: "پرداخت با موفقیت تایید شد",
        data: {
          paymentId: payment._id,
          refId: payment.refId,
          amount: payment.amount,
          status: payment.status,
          cardPan: payment.cardPan,
          fee: payment.fee,
          feeType: payment.feeType,
        },
      });
    } else if (verifyResponse.data.code === 101) {
      // Already verified
      payment.status = 'verified';
      await payment.save();

      return NextResponse.json({
        success: true,
        message: "تراکنش قبلاً تایید شده است",
        data: {
          paymentId: payment._id,
          refId: payment.refId,
          amount: payment.amount,
          status: payment.status,
          cardPan: payment.cardPan,
        },
      });
    } else {
      // Verification failed
      payment.status = 'failed';
      await payment.save();

      return NextResponse.json(
        {
          error: "تایید پرداخت ناموفق",
          message: ZarinPal.getStatusMessage(verifyResponse.data.code),
          code: verifyResponse.data.code,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.log('Payment verify error:', error);
    return NextResponse.json(
      { error: "خطای سرور در تایید پرداخت" },
      { status: 500 }
    );
  }
}