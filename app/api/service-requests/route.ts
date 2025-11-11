import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Request from "@/models/request";
import DynamicService from "@/models/services";
import { sendStatusUpdateSMS } from "@/lib/sms";
import { processReferralReward } from "@/lib/referralRewardProcessor";
import "@/models/users"; // Import User model for populate to work

// Type for MongoDB query filters
interface RequestQueryFilter {
  status?: string;
  service?: string;
}



// Type for POST request body
interface CreateRequestBody {
  service: string;
  data: Record<string, string>;
  customer: string;
  customerEmail?: string;
  customerName?: string;
  priority?: string;
  assignedTo?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  paymentDate?: Date;
  paymentAmount?: number;
}

// Type for PUT request body
interface UpdateRequestBody {
  id: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  rejectedReason?: string;
  adminNote?: string;
  isNoteVisibleToCustomer?: boolean;
}



// GET - Retrieve service requests with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const serviceId = searchParams.get("serviceId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const request = await Request.findById(id).populate('service');
      if (!request) {
        return NextResponse.json(
          { success: false, message: "Service request not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: request });
    }

    // Build query filters
    const query: RequestQueryFilter = {};
    if (status) {
      query.status = status;
    }
    if (serviceId) {
      query.service = serviceId;
    }

    const skip = (page - 1) * limit;
    const requests = await Request
      .find(query)
      .populate('service' )
      .populate('customer', 'nationalCredentials.firstName nationalCredentials.lastName contactInfo.email contactInfo.mobilePhone')
      .populate('assignedTo', 'nationalCredentials.firstName nationalCredentials.lastName')
      .populate('adminNotes.addedBy', 'nationalCredentials.firstName nationalCredentials.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Request.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.log("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new service request
export async function POST(request: NextRequest) {
  try {
    await connect();
    const body: CreateRequestBody = await request.json();

    // Validate required fields
    if (!body.service) {
      return NextResponse.json(
        { success: false, message: "service is required" },
        { status: 400 }
      );
    }
    if (!body.data) {
      return NextResponse.json(
        { success: false, message: "data is required" },
        { status: 400 }
      );
    }
    if (!body.customer) {
      return NextResponse.json(
        { success: false, message: "customer is required" },
        { status: 400 }
      );
    }

    // Verify service exists and get its details
    if (!mongoose.Types.ObjectId.isValid(body.service)) {
      return NextResponse.json(
        { success: false, message: "Invalid service ID" },
        { status: 400 }
      );
    }

    const service = await DynamicService.findById(body.service);
    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    // Calculate payment amount - use provided amount or service fee
    const paymentAmount = body.paymentAmount || service.fee;

    // Generate request number
    const timestamp = Date.now();
    const requestNumber = `SERVICE-WALLET-${timestamp}`;

    const serviceRequest = new Request({
      service: body.service,
      data: body.data,
      customer: body.customer,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      paymentAmount: paymentAmount,
      requestNumber: requestNumber,
      priority: body.priority || 'medium',
      assignedTo: body.assignedTo,
      isPaid: body.isPaid !== undefined ? body.isPaid : false,
      paymentMethod: body.paymentMethod || 'wallet',
      paymentDate: body.isPaid ? (body.paymentDate || new Date()) : undefined,
    });

    await serviceRequest.save();

    // Populate the service details for response
    await serviceRequest.populate('service', 'title icon slug fee');

    // Process referral rewards
    console.log("\n========================================");
    console.log("SERVICE REQUEST CREATED - CHECKING FOR REFERRAL REWARDS");
    console.log("========================================");
    console.log("Service Request ID:", serviceRequest._id);
    console.log("Customer ID:", body.customer);
    console.log("Service Slug:", service.slug);
    console.log("Payment Amount:", paymentAmount);
    console.log("Is Paid:", serviceRequest.isPaid);
    
    if (paymentAmount && paymentAmount > 0) {
      console.log("✓ Payment conditions met - processing referral rewards...");
      try {
        const rewardParams = {
          userId: body.customer,
          actionType: "dynamicServices" as const,
          serviceSlug: service.slug,
          transactionAmount: paymentAmount,
          transactionId: serviceRequest._id.toString(),
        };
        
        console.log("Calling processReferralReward with params:", JSON.stringify(rewardParams, null, 2));
        
        const rewardResult = await processReferralReward(rewardParams);
        
        console.log("Reward processing result:", JSON.stringify(rewardResult, null, 2));
        
        if (rewardResult.success && (rewardResult.referrerReward || rewardResult.refereeReward)) {
          console.log(`✓ Referral rewards processed for service request ${serviceRequest._id}:`);
          console.log(`  - Referrer reward: ${rewardResult.referrerReward}`);
          console.log(`  - Referee reward: ${rewardResult.refereeReward}`);
        } else {
          console.log("ℹ No referral rewards applied:", rewardResult.message);
        }
      } catch (error) {
        console.error("❌ Error processing referral reward:", error);
        // Don't fail the request if reward processing fails
      }
    } else {
      console.log("✗ Payment conditions not met - skipping referral rewards");
    }
    console.log("========================================\n");

    return NextResponse.json(
      {
        success: true,
        message: "Service request created successfully",
        data: serviceRequest,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("POST Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update service request (mainly for admin status updates)
export async function PUT(request: NextRequest) {
  try {
    await connect();
    const body: UpdateRequestBody = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    ).populate('service', 'title icon slug')
     .populate('customer', 'nationalCredentials.firstName nationalCredentials.lastName contactInfo.mobilePhone')
     .populate('assignedTo', 'name');

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: "Service request not found" },
        { status: 404 }
      );
    }

    // Send SMS notification when status is updated
    if (updateData.status && updatedRequest.customer) {
      const customer = updatedRequest.customer as any;
      const service = updatedRequest.service as any;
      
      const customerName = customer?.nationalCredentials?.firstName 
        ? `${customer.nationalCredentials.firstName} ${customer.nationalCredentials.lastName || ''}`
        : 'کاربر';
      const orderName = service?.title || 'سفارش شما';
      const phone = customer?.contactInfo?.mobilePhone;

      if (phone) {
        try {
          await sendStatusUpdateSMS(phone, customerName, orderName);
          console.log(`SMS sent to ${phone} for service request ${id}`);
        } catch (error) {
          console.log('Failed to send SMS:', error);
          // Don't fail the request if SMS fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Service request updated successfully",
      data: updatedRequest,
    });
  } catch (error: unknown) {
    console.log("PUT Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service request
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body: { id: string } = await request.json();
        id = body.id;
      } catch {
        // Continue with null id
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, message: "Service request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service request deleted successfully",
      data: deletedRequest,
    });
  } catch (error: unknown) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}