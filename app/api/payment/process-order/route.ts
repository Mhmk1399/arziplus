import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import Request from "@/models/request";
import Lottery from "@/models/lottery";
import Wallet from "@/models/wallet";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/auth";

// Helper function to extract user ID from JWT token
interface payment {
  metadata: {
    serviceData: string;
    serviceId: string;
    customerName: string;
    lotteryData: string;
  };
  serviceId: string;
  userId: string;
  amount: number;
  description: string;
  currency: string;
  orderId: string;
  authority: string;
  status: string;
  zarinpalMessage: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt: Date;
  _id: string;
  __v: number;
}

// Helper function to generate unique request number
async function generateRequestNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Request.countDocuments({
    createdAt: { $gte: new Date(year, 0, 1) },
  });
  return `REQ-${year}-${String(count + 1).padStart(3, "0")}`;
}

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Extract and verify JWT token
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader);

    const authUser = getAuthUser(request);
    console.log("Auth user:", authUser);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          debug: {
            hasAuthHeader: !!authHeader,
            authHeaderValue: authHeader ? "Bearer [token]" : "missing",
          },
        },
        { status: 401 }
      );
    }

    const { authority } = await request.json();

    if (!authority) {
      return NextResponse.json(
        { success: false, error: "کد پیگیری ارائه نشده است" },
        { status: 400 }
      );
    }

    // Find the payment by authority
    const payment = await Payment.findOne({ authority });
    if (!payment) {
      return NextResponse.json(
        { success: false, error: "پرداخت یافت نشد" },
        { status: 404 }
      );
    }

    // Check if payment is verified
    if (payment.status !== "verified") {
      return NextResponse.json(
        { success: false, error: "پرداخت تایید نشده است" },
        { status: 400 }
      );
    }

    // Check if the payment belongs to the current user
    if (payment.userId.toString() !== authUser.id) {
      return NextResponse.json(
        { success: false, error: "عدم دسترسی به این پرداخت" },
        { status: 403 }
      );
    }

    // Determine payment type from orderId prefix
    const orderId = payment.orderId;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "شناسه سفارش یافت نشد" },
        { status: 400 }
      );
    }

    let result = null;

    if (orderId.startsWith("SERVICE-")) {
      // Create service request
      result = await createServiceRequest(payment, authUser.id);
    } else if (orderId.startsWith("LOTTERY-")) {
      // Create lottery registration
      result = await createLotteryRegistration(payment, authUser.id);
    } else if (
      orderId.startsWith("WALLET-") ||
      payment.description.includes("شارژ کیف پول") ||
      payment.description.includes("شارژ") ||
      !payment.serviceId
    ) {
      // Create wallet charge - handle cases where orderId starts with WALLET- or description indicates wallet charge or no serviceId
      result = await createWalletCharge(payment, authUser.id);
    } else if (orderId.startsWith("HOZORI-")) {
      // Handle hozori (in-person) requests - similar to service requests
      result = await createServiceRequest(payment, authUser.id);
    } else {
      return NextResponse.json(
        { success: false, error: "نوع پرداخت شناسایی نشد" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "سفارش با موفقیت ایجاد شد",
    });
  } catch (error) {
    console.log("Process order error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش سفارش" },
      { status: 500 }
    );
  }
}

async function createServiceRequest(payment: payment, userId: string) {
  try {
    // Get service data from payment metadata
    const serviceData = payment.metadata?.serviceData
      ? JSON.parse(payment.metadata.serviceData)
      : {};

    if (!payment.serviceId) {
      throw new Error("شناسه سرویس یافت نشد");
    }

    // Generate unique request number
    const requestNumber = await generateRequestNumber();

    // Create service request
    const serviceRequest = new Request({
      service: new mongoose.Types.ObjectId(payment.serviceId),
      data: serviceData,
      customer: new mongoose.Types.ObjectId(userId),
      customerName: payment.metadata?.customerName || "کاربر",
      status: "pending",
      isPaid: true,
      paymentAmount: payment.amount,
      paymentDate: payment.verifiedAt || new Date(),
      paymentMethod: "direct",
      requestNumber,
      priority: "medium",
    });

    await serviceRequest.save();

    return {
      type: "service",
      id: serviceRequest._id,
      requestNumber: serviceRequest.requestNumber,
      status: serviceRequest.status,
    };
  } catch (error) {
    console.log("Error creating service request:", error);
    throw error;
  }
}

async function createLotteryRegistration(payment: payment, userId: string) {
  try {
    // Get lottery data from payment metadata
    const lotteryData = payment.metadata?.lotteryData
      ? JSON.parse(payment.metadata.lotteryData)
      : {};

    // Create lottery registration
    const lotteryRegistration = new Lottery({
      userId: userId,
      status: "pending",
      paymentMethod: "direct",
      paymentAmount: payment.amount,
      isPaid: true,
      paymentDate: payment.verifiedAt || new Date(),
      // Copy all lottery form data
      ...lotteryData,
      submittedAt: new Date(),
    });

    await lotteryRegistration.save();

    return {
      type: "lottery",
      id: lotteryRegistration._id,
      status: lotteryRegistration.status,
    };
  } catch (error) {
    console.log("Error creating lottery registration:", error);
    throw error;
  }
}

async function createWalletCharge(payment: payment, userId: string) {
  try {
    // Find or create user wallet
    let wallet = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!wallet) {
      wallet = new Wallet({
        userId: new mongoose.Types.ObjectId(userId),
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
    }

    // Add income transaction
    wallet.inComes.push({
      amount: payment.amount,
      tag: "شارژ",
      description: `شارژ کیف پول - کد پیگیری: ${payment.authority}`,
      date: payment.verifiedAt || new Date(),
      verifiedAt: payment.verifiedAt || new Date(),
      status: "verified",
      verifiedBy: new mongoose.Types.ObjectId(userId), // Self-verified through payment
    });

    // Update balance
    const currentBalance =
      wallet.balance.length > 0
        ? wallet.balance[wallet.balance.length - 1].amount
        : 0;

    wallet.balance.push({
      amount: currentBalance + payment.amount,
      updatedAt: new Date(),
    });

    await wallet.save();

    return {
      type: "wallet",
      id: wallet._id,
      amount: payment.amount,
      newBalance: currentBalance + payment.amount,
    };
  } catch (error) {
    console.log("Error creating wallet charge:", error);
    throw error;
  }
}
