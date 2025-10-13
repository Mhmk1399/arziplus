import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import { ZarinPal } from "@/lib/zarinpal";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    
    console.log(`Payment callback received: Authority=${authority}, Status=${status}`);

    if (!authority) {
      return NextResponse.redirect(
        new URL('/payment/failed?error=missing_authority', request.url)
      );
    }

    await connect();

    // Find payment by authority - if multiple exist, use the first non-verified one
    let payment = await Payment.findOne({ 
      authority, 
      status: { $ne: 'verified' } 
    }).sort({ createdAt: 1 });
    
    // If no non-verified payment found, check if there's already a verified one
    if (!payment) {
      const verifiedPayment = await Payment.findOne({ 
        authority, 
        status: 'verified' 
      });
      
      if (verifiedPayment) {
        // Payment already verified, redirect to success
        return NextResponse.redirect(
          new URL(`/payment/success?Authority=${authority}&Status=OK&duplicate=true`, request.url)
        );
      }
      
      // No payment found at all
      return NextResponse.redirect(
        new URL('/payment/failed?error=payment_not_found', request.url)
      );
    }

    // Check if payment was cancelled or failed
    if (status !== 'OK') {
      payment.status = 'cancelled';
      payment.zarinpalMessage = 'پرداخت توسط کاربر لغو شد';
      await payment.save();

      return NextResponse.redirect(
        new URL(`/payment/failed?Authority=${authority}&Status=${status}&error=cancelled`, request.url)
      );
    }

    // Check if already verified
    if (payment.status === 'verified') {
      return NextResponse.redirect(
        new URL(`/payment/success?Authority=${authority}&Status=OK&duplicate=true`, request.url)
      );
    }

    try {
      // Verify payment with ZarinPal
      const verifyResponse = await ZarinPal.verifyPayment({
        amount: payment.amount,
        authority: authority,
      });

      // Update payment record
      payment.zarinpalCode = verifyResponse.data.code;
      payment.zarinpalMessage = verifyResponse.data.message;

      if (verifyResponse.data.code === 100) {
        // Successful payment
        payment.status = 'verified';
        payment.refId = verifyResponse.data.ref_id;
        payment.cardPan = verifyResponse.data.card_pan;
        payment.cardHash = verifyResponse.data.card_hash;
        payment.feeType = verifyResponse.data.fee_type;
        payment.fee = verifyResponse.data.fee;
        payment.verifiedAt = new Date();
        payment.paidAt = new Date();

        await payment.save();
        
        console.log(`Payment verified successfully: ${authority}, redirecting to success page`);

        return NextResponse.redirect(
          new URL(`/payment/success?Authority=${authority}&Status=OK`, request.url)
        );
      } else if (verifyResponse.data.code === 101) {
        // Already verified
        payment.status = 'verified';
        await payment.save();

        return NextResponse.redirect(
          new URL(`/payment/success?Authority=${authority}&Status=OK&duplicate=true`, request.url)
        );
      } else {
        // Payment failed verification
        payment.status = 'failed';
        await payment.save();

        return NextResponse.redirect(
          new URL(`/payment/failed?Authority=${authority}&Status=NOK&code=${verifyResponse.data.code}`, request.url)
        );
      }
    } catch (verifyError) {
      console.error('Payment verification error:', verifyError);
      
      // Update payment status to failed
      payment.status = 'failed';
      payment.zarinpalMessage = 'خطا در تایید پرداخت';
      await payment.save();

      return NextResponse.redirect(
        new URL(`/payment/failed?Authority=${authority}&Status=NOK&error=verify_error`, request.url)
      );
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/failed?error=server_error', request.url)
    );
  }
}