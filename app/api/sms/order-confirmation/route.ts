import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationSMS } from "@/lib/sms";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Extract user from token
    const user = getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, customerName } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if user has phone number
    if (!user.phone) {
      return NextResponse.json(
        { success: false, error: "User phone number not found" },
        { status: 400 }
      );
    }

    // Use customer name from request or fall back to user data
    const name = customerName || 
      (user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || "کاربر");

    // Send SMS
    const smsSent = await sendOrderConfirmationSMS(
      user.phone,
      name,
      orderId
    );

    if (smsSent) {
      return NextResponse.json({
        success: true,
        message: "SMS sent successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send SMS" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("SMS API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}
