import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Request from "@/models/request";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز - ورود به سیستم لازم است" },
        { status: 401 }
      );
    }

    await connect();

    // Get all user's requests
    const userRequests = await Request.find({ customer: authUser.id });

    // Calculate statistics
    const stats = {
      totalRequests: userRequests.length,
      pendingRequests: userRequests.filter(req => req.status === 'pending').length,
      completedRequests: userRequests.filter(req => req.status === 'completed').length,
      rejectedRequests: userRequests.filter(req => req.status === 'rejected').length,
      inProgressRequests: userRequests.filter(req => req.status === 'in_progress').length,
      requiresInfoRequests: userRequests.filter(req => req.status === 'requires_info').length,
      cancelledRequests: userRequests.filter(req => req.status === 'cancelled').length,
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: unknown) {
    console.error('Customer requests stats error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}