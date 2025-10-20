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
}

// Type for MongoDB query filters
interface HozoriQueryFilter {
  userId?: string;
  status?: string;
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

    // Validate required fields
    const requiredFields = [
      'name', 
      'lastname', 
      'phoneNumber', 
      'maridgeStatus', 
      'Date', 
      'time',
      'paymentType'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `فیلد ${field} الزامی است` },
          { status: 400 }
        );
      }
    }

    // Validate phone number format
    if (!/^09\d{9}$/.test(body.phoneNumber)) {
      return NextResponse.json(
        { success: false, error: "فرمت شماره تلفن صحیح نیست" },
        { status: 400 }
      );
    }

    // Validate children count
    if (body.childrensCount < 0 || body.childrensCount > 10) {
      return NextResponse.json(
        { success: false, error: "تعداد فرزندان باید بین 0 تا 10 باشد" },
        { status: 400 }
      );
    }

    // Validate marital status
    const validMaritalStatus = ['single', 'married'];
    if (!validMaritalStatus.includes(body.maridgeStatus)) {
      return NextResponse.json(
        { success: false, error: "وضعیت تأهل معتبر نیست" },
        { status: 400 }
      );
    }

    // Validate time slot
    const validTimeSlots = ['09:00', '10:00', '14:00', '15:00'];
    if (!validTimeSlots.includes(body.time)) {
      return NextResponse.json(
        { success: false, error: "زمان انتخابی معتبر نیست" },
        { status: 400 }
      );
    }

    // Convert date string to Date object if needed
    let appointmentDate: Date;
    try {
      appointmentDate = new Date(body.Date);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "فرمت تاریخ صحیح نیست" },
        { status: 400 }
      );
    }

    // Check if the selected date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, error: "نمی‌توان تاریخ گذشته انتخاب کرد" },
        { status: 400 }
      );
    }

    // Check if there's already a reservation for the same date and time
    const existingReservation = await Hozori.findOne({
      Date: appointmentDate,
      time: body.time
    });

    if (existingReservation) {
      return NextResponse.json(
        { success: false, error: "این زمان قبلاً رزرو شده است" },
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
      updatedAt: new Date()
    });

    // Save to database
    const savedHozori = await newHozori.save();

    // Log the creation
    console.log(`New hozori reservation created: ${savedHozori._id} for user: ${authUser.id}`);

    return NextResponse.json({
      success: true,
      message: "رزرو وقت حضوری با موفقیت ثبت شد",
      data: {
        id: savedHozori._id,
        name: savedHozori.name,
        lastname: savedHozori.lastname,
        phoneNumber: savedHozori.phoneNumber,
        Date: savedHozori.Date,
        time: savedHozori.time,
        status: "confirmed"
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating hozori reservation:", error);
    
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: `خطای اعتبارسنجی: ${validationErrors.join(', ')}` },
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: HozoriQueryFilter = {
      userId: authUser.id
    };

    // Add status filter if provided
    const status = searchParams.get('status');
    if (status) {
      filter.status = status;
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
        limit
      }
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
    const { id, ...updateData } = await request.json();

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

    if (hozoriReservation.userId !== authUser.id) {
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
      data: updatedHozori
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
    const id = searchParams.get('id');

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

    if (hozoriReservation.userId !== authUser.id) {
      return NextResponse.json(
        { success: false, error: "شما مجاز به حذف این رزرو نیستید" },
        { status: 403 }
      );
    }

    // Delete the reservation
    await Hozori.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "رزرو با موفقیت حذف شد"
    });

  } catch (error) {
    console.error("Error deleting hozori reservation:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}