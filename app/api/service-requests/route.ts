import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";

// Service Request Schema
const ServiceRequestSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'dynamicServices', required: true },
  serviceName: { type: String, required: true },
  serviceSlug: { type: String, required: true },
  serviceFee: { type: Number, required: true },
  userInputs: { type: mongoose.Schema.Types.Mixed, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  userId: { type: mongoose.Schema.Types.ObjectId }, // Add when user auth is implemented
  notes: { type: String }, // Admin notes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ServiceRequest = mongoose.models.ServiceRequest || 
  mongoose.model("ServiceRequest", ServiceRequestSchema);

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

      const request = await ServiceRequest.findById(id).populate('serviceId');
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
      query.serviceId = serviceId;
    }

    const skip = (page - 1) * limit;
    const requests = await ServiceRequest
      .find(query)
      .populate('serviceId', 'title icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ServiceRequest.countDocuments(query);

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
    const requiredFields = ['serviceId', 'serviceName', 'userInputs', 'serviceFee'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Verify service exists
    if (!mongoose.Types.ObjectId.isValid(body.serviceId)) {
      return NextResponse.json(
        { success: false, message: "Invalid service ID" },
        { status: 400 }
      );
    }

    const serviceRequest = new ServiceRequest({
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      serviceSlug: body.serviceSlug,
      serviceFee: body.serviceFee,
      userInputs: body.userInputs,
      totalAmount: body.totalAmount || body.serviceFee,
      userId: body.userId, // Add when auth is implemented
      notes: body.notes,
    });

    await serviceRequest.save();

    // Populate the service details for response
    await serviceRequest.populate('serviceId', 'title icon');

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

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('serviceId', 'title icon');

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

    const deletedRequest = await ServiceRequest.findByIdAndDelete(id);

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