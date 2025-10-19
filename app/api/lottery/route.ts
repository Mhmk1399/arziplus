import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Lottery from "@/models/lottery";
import { getAuthUser } from "@/lib/auth";

// Type for MongoDB query filters
interface LotteryQueryFilter {
  userId?: string;
  status?: string;
}

// Type for POST request body
interface CreateLotteryBody {
  famillyInformations: Array<{
    maridgeState: boolean;
    numberOfChildren: number;
    towPeopleRegistration: boolean;
  }>;
  registererInformations: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      birthDate: {
        year: string;
        month: string;
        day: string;
      };
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    residanceInformation: Array<{
      residanceCountry: string;
      residanceCity: string;
      residanseState: string;
      postalCode: string;
      residanseAdress: string;
    }>;
    contactInformations: Array<{
      activePhoneNumber: string;
      secondaryPhoneNumber: string;
      email: string;
      password: string;
    }>;
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererPartnerInformations?: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererChildformations?: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  // Payment information
  paymentMethod: "wallet" | "direct" | "card";
  paymentAmount: number;
  isPaid?: boolean;
  receiptUrl?: string;
}

// Type for PUT request body
interface UpdateLotteryBody {
  id: string;
  status?: "pending" | "in_review" | "approved" | "rejected" | "completed";
  rejectionReason?: string;
  adminNotes?: string;
  reviewedBy?: string;
  famillyInformations?: Array<{
    maridgeState: boolean;
    numberOfChildren: number;
    towPeopleRegistration: boolean;
  }>;
  registererInformations?: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    residanceInformation: Array<{
      residanceCountry: string;
      residanceCity: string;
      residanseState: string;
      postalCode: string;
      residanseAdress: string;
    }>;
    contactInformations: Array<{
      activePhoneNumber: string;
      secondaryPhoneNumber: string;
      email: string;
      password: string;
    }>;
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererPartnerInformations?: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererChildformations?: Array<{
    initialInformations: {
      firstName: string;
      lastName: string;
      gender: string;
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
      country: string;
      city: string;
      citizenshipCountry: string;
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
}

// GET - Retrieve lottery registrations with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Check authentication for user-specific requests
    const authUser = getAuthUser(request);

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const lottery = await Lottery.findById(id).populate(
        "reviewedBy",
        "nationalCredentials.firstName nationalCredentials.lastName"
      );
      if (!lottery) {
        return NextResponse.json(
          { success: false, message: "Lottery registration not found" },
          { status: 404 }
        );
      }

      // Check if user can access this lottery
      if (userId && lottery.userId !== authUser?.id) {
        return NextResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: lottery });
    }

    // Build query filters
    const query: LotteryQueryFilter = {};

    // For regular users, only show their own lotteries
    if (userId) {
      if (!authUser || authUser.id !== userId) {
        return NextResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }
      query.userId = userId;
    }

    // For admins, allow filtering by status
    if (status && authUser?.roles.includes("admin")) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const lotteries = await Lottery.find(query)
      .populate(
        "reviewedBy",
        "nationalCredentials.firstName nationalCredentials.lastName"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lottery.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: lotteries,
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

// POST - Create new lottery registration
export async function POST(request: NextRequest) {
  try {
    await connect();
    const body: CreateLotteryBody = await request.json();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.famillyInformations || body.famillyInformations.length === 0) {
      return NextResponse.json(
        { success: false, message: "Family informations are required" },
        { status: 400 }
      );
    }
    if (
      !body.registererInformations ||
      body.registererInformations.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Registerer informations are required" },
        { status: 400 }
      );
    }

    // Validate that registerer initial informations are provided
    if (!body.registererInformations[0]?.initialInformations) {
      return NextResponse.json(
        {
          success: false,
          message: "Registerer initial informations are required",
        },
        { status: 400 }
      );
    }

    const lottery = new Lottery({
      userId: authUser.id, // Add the user ID from authentication
      famillyInformations: body.famillyInformations,
      registererInformations: body.registererInformations,
      registererPartnerInformations: body.registererPartnerInformations || [],
      registererChildformations: body.registererChildformations || [],
      // Payment information
      paymentMethod: body.paymentMethod,
      paymentAmount: body.paymentAmount,
      isPaid: body.isPaid || false,
      receiptUrl: body.receiptUrl,
    });

    await lottery.save();

    return NextResponse.json(
      {
        success: true,
        message: "Lottery registration created successfully",
        data: lottery,
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

// PUT - Update lottery registration
export async function PUT(request: NextRequest) {
  try {
    await connect();
    const body: UpdateLotteryBody = await request.json();
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

    const updatedLottery = await Lottery.findByIdAndUpdate(
      id,
      {
        ...updateData,
        ...(updateData.status &&
          updateData.status !== "pending" && {
            reviewedAt: new Date(),
            reviewedBy: updateData.reviewedBy,
          }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedLottery) {
      return NextResponse.json(
        { success: false, message: "Lottery registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lottery registration updated successfully",
      data: updatedLottery,
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

// DELETE - Delete lottery registration
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

    const deletedLottery = await Lottery.findByIdAndDelete(id);

    if (!deletedLottery) {
      return NextResponse.json(
        { success: false, message: "Lottery registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lottery registration deleted successfully",
      data: deletedLottery,
    });
  } catch (error: unknown) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
