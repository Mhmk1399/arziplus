import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Hozori from "@/models/hozori";
import { getAuthUser } from "@/lib/auth";

// Type for POST request body
interface CreateHozoriBody {
  name: string;
  lastname: string;
  phoneNumber: string;
  childrensCount: number;
  maridgeStatus: string;
  Date: string | Date;
  time: string;
  paymentType: string;
  paymentDate: string | Date;
  paymentImage: string;
  [key: string]: string | number | Date; // Add index signature to allow multiple types
}

// Type for MongoDB query filters
interface HozoriQueryFilter {
  userId?: string;
  status?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    lastname?: { $regex: string; $options: string };
    phoneNumber?: { $regex: string; $options: string };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connect();

    // Get authenticated user
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateHozoriBody = await request.json();

    // Debug logging
    console.log("Received hozori request body:", body);
    console.log("Body type and validation:");
    console.log("- name:", typeof body.name, body.name);
    console.log("- lastname:", typeof body.lastname, body.lastname);
    console.log("- phoneNumber:", typeof body.phoneNumber, body.phoneNumber);
    console.log(
      "- childrensCount:",
      typeof body.childrensCount,
      body.childrensCount
    );
    console.log(
      "- maridgeStatus:",
      typeof body.maridgeStatus,
      body.maridgeStatus
    );
    console.log("- Date:", typeof body.Date, body.Date);
    console.log("- time:", typeof body.time, body.time);
    console.log("- paymentType:", typeof body.paymentType, body.paymentType);

    // Validate required fields
    const requiredFields = [
      "name",
      "lastname",
      "phoneNumber",
      "maridgeStatus",
      "Date",
      "time",
      "paymentType",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`, body[field]);
        return NextResponse.json(
          {
            success: false,
            error: `فیلد ${field} الزامی است`,
            message: `Missing field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate phone number format
    if (!/^09\d{9}$/.test(body.phoneNumber)) {
      console.error("Invalid phone number format:", body.phoneNumber);
      return NextResponse.json(
        {
          success: false,
          error: "فرمت شماره تلفن صحیح نیست",
          message: `Invalid phone format: ${body.phoneNumber}`,
        },
        { status: 400 }
      );
    }

    // Validate children count
    if (body.childrensCount < 0 || body.childrensCount > 10) {
      console.error("Invalid children count:", body.childrensCount);
      return NextResponse.json(
        {
          success: false,
          error: "تعداد فرزندان باید بین 0 تا 10 باشد",
          message: `Invalid children count: ${body.childrensCount}`,
        },
        { status: 400 }
      );
    }

    // Validate marital status
    const validMaritalStatus = ["single", "married"];
    if (!validMaritalStatus.includes(body.maridgeStatus)) {
      console.error("Invalid marital status:", body.maridgeStatus);
      return NextResponse.json(
        {
          success: false,
          error: "وضعیت تأهل معتبر نیست",
          message: `Invalid marital status: ${body.maridgeStatus}`,
        },
        { status: 400 }
      );
    }

    // Validate time slot
    const validTimeSlots = ["09:00", "10:00", "14:00", "15:00"];
    if (!validTimeSlots.includes(body.time)) {
      console.error("Invalid time slot:", body.time);
      return NextResponse.json(
        {
          success: false,
          error: "زمان انتخابی معتبر نیست",
          message: `Invalid time slot: ${body.time}`,
        },
        { status: 400 }
      );
    }

    // Convert date string to Date object without timezone issues
    let appointmentDate: Date;
    try {
      console.log("Parsing date:", body.Date);

      // Parse date string (YYYY-MM-DD) and create UTC date to avoid timezone issues
      if (
        typeof body.Date === "string" &&
        body.Date.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        const [year, month, day] = body.Date.split("-").map(Number);
        appointmentDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // Set to noon UTC to avoid timezone shifts
      } else {
        appointmentDate = new Date(body.Date);
      }

      console.log("Parsed date:", appointmentDate);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      console.error("Date parsing error:", error, "Original date:", body.Date);
      return NextResponse.json(
        {
          success: false,
          error: "فرمت تاریخ صحیح نیست",
          message: `Date parsing error: ${body.Date}`,
        },
        { status: 400 }
      );
    }

    // Check if the selected date is not in the past
    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0)
    );

    console.log("Date validation - Today UTC:", todayUTC);
    console.log("Date validation - Appointment:", appointmentDate);
    console.log("Date validation - Is past?", appointmentDate < todayUTC);

    if (appointmentDate < todayUTC) {
      console.error(
        "Past date error - Today UTC:",
        todayUTC,
        "Appointment:",
        appointmentDate
      );
      return NextResponse.json(
        {
          success: false,
          error: "نمی‌توان تاریخ گذشته انتخاب کرد",
          message: `Past date: ${appointmentDate} < ${todayUTC}`,
        },
        { status: 400 }
      );
    }

    // Check if there's already a reservation for the same date and time
    console.log("Checking for existing reservations...");
    try {
      const existingReservation = await Hozori.findOne({
        Date: appointmentDate,
        time: body.time,
      });

      console.log("Existing reservation check result:", existingReservation);

      if (existingReservation) {
        console.error(
          "Conflict - existing reservation found:",
          existingReservation
        );
        return NextResponse.json(
          {
            success: false,
            error: "این زمان قبلاً رزرو شده است",
            message: `Time slot already booked: ${body.time} on ${appointmentDate}`,
          },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error(
        "Database error during existing reservation check:",
        dbError
      );
      return NextResponse.json(
        { success: false, error: "خطا در بررسی رزروهای موجود" },
        { status: 400 }
      );
    }

    // Create payment date
    let paymentDate: Date;
    try {
      paymentDate = body.paymentDate ? new Date(body.paymentDate) : new Date();
    } catch (error) {
      paymentDate = new Date();
    }

    // Create new hozori reservation
    console.log("Creating new hozori reservation with data:", {
      name: body.name.trim(),
      lastname: body.lastname.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrensCount: body.childrensCount,
      maridgeStatus: body.maridgeStatus,
      Date: appointmentDate,
      time: body.time,
      paymentType: body.paymentType,
      paymentDate: paymentDate,
      paymentImage: body.paymentImage || "",
      userId: authUser.id,
      status: "confirmed",
    });

    const newHozori = new Hozori({
      name: body.name.trim(),
      lastname: body.lastname.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrensCount: body.childrensCount,
      maridgeStatus: body.maridgeStatus,
      Date: appointmentDate,
      time: body.time,
      paymentType: body.paymentType,
      paymentDate: paymentDate,
      paymentImage: body.paymentImage || "",
      userId: authUser.id, // Add user reference
      status: "confirmed", // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to database
    console.log("Attempting to save hozori reservation...");
    let savedHozori;
    try {
      savedHozori = await newHozori.save();
      console.log("Successfully saved hozori reservation:", savedHozori._id);
    } catch (saveError) {
      console.error("Database save error:", saveError);
      return NextResponse.json(
        { success: false, error: "خطا در ذخیره رزرو" },
        { status: 400 }
      );
    }

    // Log the creation
    console.log(
      `New hozori reservation created: ${savedHozori._id} for user: ${authUser.id}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "رزرو وقت حضوری با موفقیت ثبت شد",
        data: {
          id: savedHozori._id,
          name: savedHozori.name,
          lastname: savedHozori.lastname,
          phoneNumber: savedHozori.phoneNumber,
          Date: savedHozori.Date,
          time: savedHozori.time,
          status: "confirmed",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hozori reservation:", error);

    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: `خطای اعتبارسنجی: ${validationErrors.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { success: false, error: "فرمت داده‌ها صحیح نیست" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connect();

    // Get authenticated user
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const isAdmin = searchParams.get("admin") === "true";
    const search = searchParams.get("search");
    const requestedUserId = searchParams.get("userId");

    // Build query filter
    const filter: HozoriQueryFilter = {};

    // Handle userId filtering
    if (isAdmin) {
      // Admin can request specific userId or all users
      if (requestedUserId) {
        filter.userId = requestedUserId;
      }
    } else {
      // Regular users can only see their own reservations
      filter.userId = authUser.id;
    }

    // Add status filter if provided
    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    }

    // Add search filter for admin
    if (search && isAdmin) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalCount = await Hozori.countDocuments(filter);

    // Fetch hozori reservations with pagination
    const hozoriReservations = await Hozori.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: hozoriReservations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching hozori reservations:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to database
    await connect();

    // Get authenticated user
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    // Parse request body
    const { id, admin, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه رزرو الزامی است" },
        { status: 400 }
      );
    }

    // Find and validate ownership
    const hozoriReservation = await Hozori.findById(id);

    if (!hozoriReservation) {
      return NextResponse.json(
        { success: false, error: "رزرو یافت نشد" },
        { status: 404 }
      );
    }

    // For admin requests, skip ownership validation
    // For regular users, validate ownership
    if (!admin && hozoriReservation.userId !== authUser.id) {
      return NextResponse.json(
        { success: false, error: "شما مجاز به ویرایش این رزرو نیستید" },
        { status: 403 }
      );
    }

    // Update the reservation
    const updatedHozori = await Hozori.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "رزرو با موفقیت به‌روزرسانی شد",
      data: updatedHozori,
    });
  } catch (error) {
    console.error("Error updating hozori reservation:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    await connect();

    // Get authenticated user
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const isAdmin = searchParams.get("admin") === "true";

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه رزرو الزامی است" },
        { status: 400 }
      );
    }

    // Find and validate ownership
    const hozoriReservation = await Hozori.findById(id);

    if (!hozoriReservation) {
      return NextResponse.json(
        { success: false, error: "رزرو یافت نشد" },
        { status: 404 }
      );
    }

    // For admin requests, skip ownership validation
    // For regular users, validate ownership
    if (!isAdmin && hozoriReservation.userId !== authUser.id) {
      return NextResponse.json(
        { success: false, error: "شما مجاز به حذف این رزرو نیستید" },
        { status: 403 }
      );
    }

    // Delete the reservation
    await Hozori.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "رزرو با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting hozori reservation:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
