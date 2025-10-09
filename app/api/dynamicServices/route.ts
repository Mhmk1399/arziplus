import { NextRequest, NextResponse } from "next/server";
import service from "@/models/services";
import connect from "@/lib/data";
import mongoose from "mongoose";

// Type for MongoDB query filters
interface serviceQueryFilter {
  isActive?: boolean;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
}

// GET - Retrieve services with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const services = await service.findById(id);
      if (!service) {
        return NextResponse.json(
          { success: false, message: "service not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: services });
    }

    // Build query filters
    const query: serviceQueryFilter = {};
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const services = await service
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await service.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: services,
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

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    const services = new service(body);
    await services.save();

    return NextResponse.json(
      {
        success: true,
        message: "service created successfully",
        data: services,
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
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "service name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update service
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

    const updatedservice = await service.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedservice) {
      return NextResponse.json(
        { success: false, message: "service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "service updated successfully",
      data: updatedservice,
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

// PATCH - Partial update (for toggle operations)
export async function PATCH(request: NextRequest) {
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

    const updatedservice = await service.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedservice) {
      return NextResponse.json(
        { success: false, message: "service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "service updated successfully",
      data: updatedservice,
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    // Try to get ID from query params first
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    // If not in query params, try to get from request body
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // If body parsing fails, continue with null id
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

    const deletedservice = await service.findByIdAndDelete(id);

    if (!deletedservice) {
      return NextResponse.json(
        { success: false, message: "service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "service deleted successfully",
      data: deletedservice,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
