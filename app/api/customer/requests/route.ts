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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Build query - only show user's own requests
    interface QueryFilter {
      customer: string;
      status?: string;
    }
    
    const query: QueryFilter = { customer: authUser.id };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const requests = await Request
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter admin notes to only show those visible to customers
    interface AdminNote {
      note: string;
      addedBy: string;
      addedAt: Date;
      isVisibleToCustomer: boolean;
    }
    
    const filteredRequests = requests.map(req => {
      const requestObj = req.toObject();
      requestObj.adminNotes = requestObj.adminNotes.filter((note: AdminNote) => note.isVisibleToCustomer);
      return requestObj;
    });

    const total = await Request.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: filteredRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error: unknown) {
    console.log('Customer requests error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}

// Customer response to rejection
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز - ورود به سیستم لازم است" },
        { status: 401 }
      );
    }

    await connect();
    
    interface RequestBody {
      requestId: string;
      response: string;
    }
    
    const body: RequestBody = await request.json();
    const { requestId, response } = body;

    if (!requestId || !response) {
      return NextResponse.json(
        { error: "شناسه درخواست و پاسخ الزامی است" },
        { status: 400 }
      );
    }

    const serviceRequest = await Request.findOne({ 
      _id: requestId, 
      customer: authUser.id 
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { error: "درخواست یافت نشد" },
        { status: 404 }
      );
    }

    // Add customer response as a note
    serviceRequest.adminNotes.push({
      note: `پاسخ مشتری: ${response}`,
      addedBy: authUser.id,
      addedAt: new Date(),
      isVisibleToCustomer: false // Admin will see this but customer won't see it duplicated
    });

    // If it was rejected, change status back to pending for review
    if (serviceRequest.status === 'rejected') {
      serviceRequest.status = 'requires_info';
    }

    await serviceRequest.save();

    return NextResponse.json({
      success: true,
      message: "پاسخ شما با موفقیت ثبت شد"
    });

  } catch (error: unknown) {
    console.log('Customer response error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}