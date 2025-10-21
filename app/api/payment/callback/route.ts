import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import { ZarinPal } from "@/lib/zarinpal";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    console.log(`ZarinPal Callback - Authority: ${authority}, Status: ${status}`);

    // Validate required parameters
    if (!authority) {
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?error=missing_authority`);
    }

    // Connect to database
    await connect();

    // Find payment by authority
    const payment = await Payment.findOne({ authority });

    if (!payment) {
      console.log(`Payment not found for authority: ${authority}`);
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?error=payment_not_found`);
    }

    // Check if payment was cancelled by user
    if (status !== "OK") {
      payment.status = "failed";
      payment.zarinpalMessage = "پرداخت لغو شد";
      await payment.save();

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?Authority=${authority}&Status=${status}`);
    }

    // Check if already verified
    if (payment.status === "verified") {
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/success?Authority=${authority}&Status=OK&duplicate=true`);
    }

    // Verify payment with ZarinPal
    try {
      const verifyResponse = await ZarinPal.verifyPayment({
        amount: payment.amount,
        authority: authority,
      });

      console.log(`ZarinPal verify response code: ${verifyResponse.data.code}`);

      // Update payment record with ZarinPal response
      payment.zarinpalCode = verifyResponse.data.code;
      payment.zarinpalMessage = verifyResponse.data.message;

      if (verifyResponse.data.code === 100) {
        // Payment successful - update payment record
        payment.status = "verified";
        payment.refId = verifyResponse.data.ref_id;
        payment.cardPan = verifyResponse.data.card_pan;
        payment.cardHash = verifyResponse.data.card_hash;
        payment.feeType = verifyResponse.data.fee_type;
        payment.fee = verifyResponse.data.fee;
        payment.verifiedAt = new Date();
        payment.paidAt = new Date();

        await payment.save();

        console.log(`Payment verified successfully: ${authority}`);

        // Redirect to success page
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        const redirectUrl = `${baseUrl}/payment/success?Authority=${authority}&Status=OK`;
        console.log(`Redirecting to: ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl);

      } else if (verifyResponse.data.code === 101) {
        // Payment already verified
        payment.status = "verified";
        await payment.save();

        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        return NextResponse.redirect(`${baseUrl}/payment/success?Authority=${authority}&Status=OK&duplicate=true`);

      } else {
        // Payment verification failed
        payment.status = "failed";
        await payment.save();

        console.log(`Payment verification failed with code: ${verifyResponse.data.code}`);
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        return NextResponse.redirect(`${baseUrl}/payment/failed?Authority=${authority}&Status=NOK&code=${verifyResponse.data.code}`);
      }

    } catch (verifyError) {
      console.log("ZarinPal verification error:", verifyError);

      // Update payment status to failed
      payment.status = "failed";
      payment.zarinpalMessage = "خطا در تایید پرداخت با ZarinPal";
      await payment.save();

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?Authority=${authority}&Status=NOK&error=verify_error`);
    }
  } catch (error) {
    console.log("Payment callback error:", error);
    
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    return NextResponse.redirect(`${baseUrl}/payment/failed?error=server_error`);
  }
}
