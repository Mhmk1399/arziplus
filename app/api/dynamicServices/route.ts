import { NextRequest, NextResponse } from "next/server";
import DynamicService from "@/models/services";
import connect from "@/lib/data";
import mongoose from "mongoose";

// Type for service field options
interface FieldOption {
  key: string;
  value: string;
}

// Type for service field (with legacy support)
interface ServiceField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: FieldOption[];
  items?: FieldOption[]; // Legacy support
  showIf?: {
    field: string;
    value: string;
  };
}

// Type for service document
interface ServiceDocument {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  fee: number;
  wallet: boolean;
  status: string;
  fields?: ServiceField[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for MongoDB query filters
interface ServiceQueryFilter {
  status?: string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
}

// Type for POST/PUT request body
interface ServiceRequestBody extends Partial<ServiceDocument> {
  id?: string; // For PUT requests
}



// GET - Retrieve services with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch by ID
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
        services.fields = services.fields.map((field: ServiceField) => {
          if (field.items && !field.options) {
            field.options = field.items;
            delete field.items;
          }
          return field;
        });
      }

      return NextResponse.json({ success: true, data: services });
    }

    // Fetch by slug
    if (slug) {
      const service = await DynamicService.findOne({ slug });
      if (!service) {
        return NextResponse.json(
          { success: false, message: "service not found" },
          { status: 404 }
        );
      }

      // Transform legacy data - map items to options for backwards compatibility
      if (service.fields) {
        service.fields = service.fields.map((field: ServiceField) => {
          if (field.items && !field.options) {
            field.options = field.items;
            delete field.items;
          }
          return field;
        });
      }

      return NextResponse.json({ success: true, data: service });
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
    const transformedServices = services.map((service: ServiceDocument) => {
      if (service.fields) {
        service.fields = service.fields.map((field: ServiceField) => {
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
  } catch (error: unknown) {
    console.log("GET Error:", error);
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
    const body: ServiceRequestBody = await request.json();

    // Transform fields to ensure options are properly saved
    if (body.fields) {
      body.fields = body.fields.map((field: ServiceField) => {
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
  } catch (error: unknown) {
    console.log("POST Error:", error);
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
    const body: ServiceRequestBody = await request.json();
    const { id, ...updateData } = body;

    // Transform fields to ensure options are properly saved
    if (updateData.fields) {
      updateData.fields = updateData.fields.map((field: ServiceField) => {
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

// PATCH - Partial update (for toggle operations)
export async function PATCH(request: NextRequest) {
  try {
    await connect();
    const body: ServiceRequestBody = await request.json();
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
  } catch (error: unknown) {
    console.log("PATCH Error:", error);
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
        const body: { id: string } = await request.json();
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
  } catch (error: unknown) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
