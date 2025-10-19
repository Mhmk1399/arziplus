import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import { getAuthUser } from "@/lib/auth";

interface query {
  userId?: string;
  _id?: string;
  authority?: string;
  status?: string;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز - لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    await connect();

    // Build query
    const query: query = {};

    // For regular users, only show their payments
    // For admins, show all payments if userId is not specified
    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      query.userId = authUser.id;
    } else {
      // Admin can filter by specific user
      const userId = searchParams.get("userId");
      if (userId) {
        query.userId = userId;
      }
    }

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get payments with pagination
    const payments = await Payment.find(query)
      .populate(
        "userId",
        "nationalCredentials.firstName nationalCredentials.lastName contactInfo.mobilePhone"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalPayments = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / limit);

    // Calculate statistics
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          successfulPayments: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          failedPayments: {
            $sum: {
              $cond: [{ $in: ["$status", ["failed", "cancelled"]] }, 1, 0],
            },
          },
          successfulAmount: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const statistics = stats[0] || {
      totalAmount: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      successfulAmount: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalPayments,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        statistics,
      },
    });
  } catch (error) {
    console.log("Payment history error:", error);
    return NextResponse.json(
      { error: "خطای سرور در دریافت تاریخچه پرداخت" },
      { status: 500 }
    );
  }
}

// Get specific payment details
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز - لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const { paymentId, authority } = await request.json();

    if (!paymentId && !authority) {
      return NextResponse.json(
        { error: "شناسه پرداخت یا کد پیگیری مورد نیاز است" },
        { status: 400 }
      );
    }

    await connect();

    // Build query based on user role and search parameter
    const query: query = {};

    if (paymentId) {
      query._id = paymentId;
    } else if (authority) {
      query.authority = authority;
    }

    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      query.userId = authUser.id;
    }

    const payment = await Payment.findOne(query)
      .populate(
        "userId",
        "nationalCredentials.firstName nationalCredentials.lastName contactInfo.mobilePhone"
      )
      .lean();

    if (!payment) {
      return NextResponse.json({ error: "پرداخت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.log("Payment details error:", error);
    return NextResponse.json(
      { error: "خطای سرور در دریافت جزئیات پرداخت" },
      { status: 500 }
    );
  }
}
