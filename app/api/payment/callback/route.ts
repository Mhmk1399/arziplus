import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import Wallet from "@/models/wallet";
import { ZarinPal } from "@/lib/zarinpal";

interface income {
  status: string;
  amount: number;
  verifiedAt?: Date;
}
interface outcome {
  status: string;
  amount: number;
  verifiedAt?: Date;
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    console.log(
      `Payment callback received: Authority=${authority}, Status=${status}`
    );
    console.log(`Full callback URL: ${request.url}`);
    console.log(`Request headers:`, Object.fromEntries(request.headers.entries()));

    if (!authority) {
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?error=missing_authority`);
    }

    await connect();

    // Find payment by authority - if multiple exist, use the first non-verified one
    const payment = await Payment.findOne({
      authority,
      status: { $ne: "verified" },
    }).sort({ createdAt: 1 });

    // If no non-verified payment found, check if there's already a verified one
    if (!payment) {
      const verifiedPayment = await Payment.findOne({
        authority,
        status: "verified",
      });

      if (verifiedPayment) {
        // Payment already verified, redirect to success
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        return NextResponse.redirect(
          `${baseUrl}/payment/success?Authority=${authority}&Status=OK&duplicate=true`
        );
      }

      // No payment found at all
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(`${baseUrl}/payment/failed?error=payment_not_found`);
    }

    // Check if payment was cancelled or failed
    if (status !== "OK") {
      payment.status = "cancelled";
      payment.zarinpalMessage = "پرداخت توسط کاربر لغو شد";
      await payment.save();

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?Authority=${authority}&Status=${status}&error=cancelled`
      );
    }

    // Check if already verified
    if (payment.status === "verified") {
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(
        `${baseUrl}/payment/success?Authority=${authority}&Status=OK&duplicate=true`
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
        payment.status = "verified";
        payment.refId = verifyResponse.data.ref_id;
        payment.cardPan = verifyResponse.data.card_pan;
        payment.cardHash = verifyResponse.data.card_hash;
        payment.feeType = verifyResponse.data.fee_type;
        payment.fee = verifyResponse.data.fee;
        payment.verifiedAt = new Date();
        payment.paidAt = new Date();

        await payment.save();

        // Check payment type from metadata
        console.log(`Payment metadata:`, payment.metadata);
        console.log(`Payment serviceId:`, payment.serviceId);
        
        const isServicePayment =
          payment.metadata?.type === "service_payment" && payment.serviceId;
        
        // Check if this is a lottery payment
        const isLotteryPayment = payment.metadata?.type === "lottery_payment";
        
        console.log(`Payment type - Service: ${isServicePayment}, Lottery: ${isLotteryPayment}`);

        if (isServicePayment) {
          // Handle service payment - create service request
          try {
            const ServiceRequest = (await import("@/models/request")).default;

            // Parse service data from metadata
            const serviceData = payment.metadata?.serviceData
              ? JSON.parse(payment.metadata.serviceData)
              : {};

            const serviceRequest = new ServiceRequest({
              service: payment.serviceId,
              data: serviceData,
              customer: payment.userId,
              customerName: payment.metadata?.customerName || "کاربر",
              customerPhone:
                payment.metadata?.customerPhone || payment.metadata?.mobile,
              paymentMethod: "direct",
              paymentAmount: payment.amount,
              isPaid: true,
              paymentId: payment._id,
              authority: payment.authority,
              refId: payment.refId,
            });

            await serviceRequest.save();
            console.log(
              `Service request created for payment: ${authority}, service: ${payment.serviceId}`
            );
          } catch (serviceError) {
            console.log("Error creating service request:", serviceError);
            // Don't fail the payment if service request creation fails
          }
        } else if (isLotteryPayment) {
          // Handle lottery payment - create lottery registration
          try {
            const Lottery = (await import("@/models/lottery")).default;

            // Parse lottery data from metadata
            const lotteryData = payment.metadata?.lotteryData
              ? JSON.parse(payment.metadata.lotteryData)
              : {};

            const lottery = new Lottery({
              ...lotteryData,
              userId: payment.userId,
              paymentMethod: "direct",
              paymentAmount: payment.amount,
              isPaid: true,
              paymentId: payment._id,
              authority: payment.authority,
              refId: payment.refId,
              paymentDate: new Date(),
              // No patmentImage for direct payments as they don't upload receipts
            });

            await lottery.save();
            console.log(
              `Lottery registration created for payment: ${authority}, user: ${payment.userId}`
            );
          } catch (lotteryError) {
            console.log("Error creating lottery registration:", lotteryError);
            // Don't fail the payment if lottery creation fails
          }
        } else {
          // Handle wallet top-up
          try {
            let wallet = await Wallet.findOne({ userId: payment.userId });

            if (!wallet) {
              wallet = new Wallet({
                userId: payment.userId,
                inComes: [],
                outComes: [],
                balance: [{ amount: 0, updatedAt: new Date() }],
              });
            }

            // Add payment as verified income
            wallet.inComes.push({
              amount: payment.amount,
              tag: "zarinpal_payment",
              description: `پرداخت ZarinPal - شناسه: ${authority}`,
              date: new Date(),
              status: "verified",
              verifiedAt: new Date(),
            });

            // Update balance
            const totalIncomes = wallet.inComes
              .filter((income: income) => income.status === "verified")
              .reduce((sum: number, income: income) => sum + income.amount, 0);

            const totalOutcomes = wallet.outComes
              .filter((outcome: outcome) => outcome.status === "verified")
              .reduce(
                (sum: number, outcome: outcome) => sum + outcome.amount,
                0
              );

            const newBalance = totalIncomes - totalOutcomes;
            wallet.balance.push({ amount: newBalance, updatedAt: new Date() });

            await wallet.save();

            console.log(
              `Payment added to wallet: ${authority}, amount: ${payment.amount}`
            );
          } catch (walletError) {
            console.log("Error updating wallet:", walletError);
            // Don't fail the payment if wallet update fails
          }
        }

        console.log(
          `Payment verified successfully: ${authority}, redirecting to success page`
        );

        // Get the base URL for redirect (ensure no double slash)
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        
        // Redirect based on payment type
        if (isServicePayment) {
          const redirectUrl = `${baseUrl}/payment/success?Authority=${authority}&Status=OK&type=service&service=${encodeURIComponent(
            payment.metadata?.serviceTitle || ""
          )}`;
          console.log(`Redirecting to service success: ${redirectUrl}`);
          return NextResponse.redirect(redirectUrl);
        } else if (isLotteryPayment) {
          const redirectUrl = `${baseUrl}/payment/success?Authority=${authority}&Status=OK&type=lottery`;
          console.log(`Redirecting to lottery success: ${redirectUrl}`);
          return NextResponse.redirect(redirectUrl);
        } else {
          const redirectUrl = `${baseUrl}/payment/success?Authority=${authority}&Status=OK&type=wallet`;
          console.log(`Redirecting to wallet success: ${redirectUrl}`);
          return NextResponse.redirect(redirectUrl);
        }
      } else if (verifyResponse.data.code === 101) {
        // Already verified
        payment.status = "verified";
        await payment.save();

        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        return NextResponse.redirect(
          `${baseUrl}/payment/success?Authority=${authority}&Status=OK&duplicate=true`
        );
      } else {
        // Payment failed verification
        payment.status = "failed";
        await payment.save();

        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        return NextResponse.redirect(
          `${baseUrl}/payment/failed?Authority=${authority}&Status=NOK&code=${verifyResponse.data.code}`
        );
      }
    } catch (verifyError) {
      console.log("Payment verification error:", verifyError);

      // Update payment status to failed
      payment.status = "failed";
      payment.zarinpalMessage = "خطا در تایید پرداخت";
      await payment.save();

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?Authority=${authority}&Status=NOK&error=verify_error`
      );
    }
  } catch (error) {
    console.log("Payment callback error:", error);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    return NextResponse.redirect(`${baseUrl}/payment/failed?error=server_error`);
  }
}
