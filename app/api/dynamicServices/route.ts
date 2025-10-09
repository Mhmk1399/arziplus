import { NextRequest, NextResponse } from "next/server";
import DynamicService from "@/models/services";
import connect from "@/lib/data";
import mongoose from "mongoose";

// Type for MongoDB query filters
interface ServiceQueryFilter {
  status?: string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
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

      const services = await DynamicService.findById(id);
      if (!services) {
        return NextResponse.json(
          { success: false, message: "service not found" },
          { status: 404 }
        );
      }

      // Transform legacy data - map items to options for backwards compatibility
      if (services.fields) {
        services.fields = services.fields.map((field: any) => {
          if (field.items && !field.options) {
            field.options = field.items;
            delete field.items;
          }
          return field;
        });
      }

      return NextResponse.json({ success: true, data: services });
    }

    // Build query filters
    const query: ServiceQueryFilter = {};
    if (isActive !== null && isActive !== undefined) {
      // Map isActive to status for backward compatibility
      query.status = isActive === "true" ? "active" : "inactive";
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const services = await DynamicService
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform legacy data - map items to options for backwards compatibility
    const transformedServices = services.map((service: any) => {
      if (service.fields) {
        service.fields = service.fields.map((field: any) => {
          if (field.items && !field.options) {
            field.options = field.items;
            delete field.items;
          }
          return field;
        });
      }
      return service;
    });

    const total = await DynamicService.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: transformedServices,
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

    console.log("POST Request Body:", JSON.stringify(body, null, 2));

    // Transform fields to ensure options are properly saved
    if (body.fields) {
      body.fields = body.fields.map((field: any) => {
        // Ensure select/multiselect fields have options, not items
        if (field.type === 'select' || field.type === 'multiselect') {
          return {
            ...field,
            options: field.options || field.items || []
          };
        }
        return field;
      });
    }

    console.log("Transformed Body:", JSON.stringify(body, null, 2));

    const services = new DynamicService(body);
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

    console.log("PUT Request - ID:", id);
    console.log("PUT Request - Update Data:", JSON.stringify(updateData, null, 2));

    // Transform fields to ensure options are properly saved
    if (updateData.fields) {
      updateData.fields = updateData.fields.map((field: any) => {
        // Ensure select/multiselect fields have options, not items
        if (field.type === 'select' || field.type === 'multiselect') {
          return {
            ...field,
            options: field.options || field.items || []
          };
        }
        return field;
      });
    }

    console.log("PUT Transformed Data:", JSON.stringify(updateData, null, 2));

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

    const updatedservice = await DynamicService.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    console.log("Updated service:", updatedservice ? "Success" : "Not found");

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

    console.log("PATCH Request - ID:", id);
    console.log("PATCH Request - Update Data:", JSON.stringify(updateData, null, 2));

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

    const updatedservice = await DynamicService.findByIdAndUpdate(
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

    const deletedservice = await DynamicService.findByIdAndDelete(id);

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
