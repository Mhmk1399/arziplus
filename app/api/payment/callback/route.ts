import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import Wallet from "@/models/wallet";
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
        
        // Check if this is a service payment
        const isServicePayment = payment.metadata?.type === 'service_payment' && payment.serviceId;
        
        if (isServicePayment) {
          // Handle service payment - create service request
          try {
            const ServiceRequest = (await import('@/models/request')).default;
            
            // Parse service data from metadata
            const serviceData = payment.metadata?.serviceData ? JSON.parse(payment.metadata.serviceData) : {};
            
            const serviceRequest = new ServiceRequest({
              service: payment.serviceId,
              data: serviceData,
              customer: payment.userId,
              customerName: payment.metadata?.customerName || 'کاربر',
              customerPhone: payment.metadata?.customerPhone || payment.metadata?.mobile,
              paymentMethod: 'direct',
              paymentAmount: payment.amount,
              isPaid: true,
              paymentId: payment._id,
              authority: payment.authority,
              refId: payment.refId,
            });

            await serviceRequest.save();
            console.log(`Service request created for payment: ${authority}, service: ${payment.serviceId}`);
          } catch (serviceError) {
            console.error('Error creating service request:', serviceError);
            // Don't fail the payment if service request creation fails
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
                balance: [{ amount: 0, updatedAt: new Date() }]
              });
            }

            // Add payment as verified income
            wallet.inComes.push({
              amount: payment.amount,
              tag: 'zarinpal_payment',
              description: `پرداخت ZarinPal - شناسه: ${authority}`,
              date: new Date(),
              status: 'verified',
              verifiedAt: new Date()
            });

            // Update balance
            const totalIncomes = wallet.inComes
              .filter((income: any) => income.status === 'verified')
              .reduce((sum: number, income: any) => sum + income.amount, 0);

            const totalOutcomes = wallet.outComes
              .filter((outcome: any) => outcome.status === 'verified')
              .reduce((sum: number, outcome: any) => sum + outcome.amount, 0);

            const newBalance = totalIncomes - totalOutcomes;
            wallet.balance.push({ amount: newBalance, updatedAt: new Date() });

            await wallet.save();
            
            console.log(`Payment added to wallet: ${authority}, amount: ${payment.amount}`);
          } catch (walletError) {
            console.error('Error updating wallet:', walletError);
            // Don't fail the payment if wallet update fails
          }
        }
        
        console.log(`Payment verified successfully: ${authority}, redirecting to success page`);

        // Redirect based on payment type
        if (isServicePayment) {
          return NextResponse.redirect(
            new URL(`/payment/success?Authority=${authority}&Status=OK&type=service&service=${encodeURIComponent(payment.metadata?.serviceTitle || '')}`, request.url)
          );
        } else {
          return NextResponse.redirect(
            new URL(`/payment/success?Authority=${authority}&Status=OK&type=wallet`, request.url)
          );
        }
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