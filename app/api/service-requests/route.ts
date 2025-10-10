import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Request from "@/models/request";
import DynamicService from "@/models/services";

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
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (serviceId) {
      query.service = serviceId;
    }

    const skip = (page - 1) * limit;
    const requests = await Request
      .find(query)
      .populate('service', 'title icon slug fee')
      .populate('customer', 'nationalCredentials.firstName nationalCredentials.lastName contactInfo.email contactInfo.mobilePhone')
      .populate('assignedTo', 'nationalCredentials.firstName nationalCredentials.lastName')
      .populate('adminNotes.addedBy', 'nationalCredentials.firstName nationalCredentials.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
  } catch (error) {
    console.error("GET Error:", error);
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
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['service', 'data', 'customer'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
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

    // Calculate payment amount
    const paymentAmount = service.fee;

    const serviceRequest = new Request({
      service: body.service,
      data: body.data,
      customer: body.customer,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      paymentAmount: paymentAmount,
      priority: body.priority || 'medium',
      assignedTo: body.assignedTo,
    });

    await serviceRequest.save();

    // Populate the service details for response
    await serviceRequest.populate('service', 'title icon slug fee');

    return NextResponse.json(
      {
        success: true,
        message: "Service request created successfully",
        data: serviceRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
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
    const body = await request.json();
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
     .populate('customer', 'name email')
     .populate('assignedTo', 'name');

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: "Service request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("PUT Error:", error);
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
        const body = await request.json();
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
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}