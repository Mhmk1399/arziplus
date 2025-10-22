import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Hozori from "@/models/hozori";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { orderId, userId, paymentDate, hozoriData } = await request.json();

    if (!orderId || !userId || !hozoriData) {
      return NextResponse.json(
        { success: false, error: "اطلاعات ناقص" },
        { status: 400 }
      );
    }

    // Parse the date
    let appointmentDate: Date;
    if (hozoriData.Date) {
      appointmentDate = new Date(hozoriData.Date);
    } else {
      throw new Error("تاریخ رزرو یافت نشد");
    }

    // Create hozori reservation
    const hozoriReservation = new Hozori({
      name: hozoriData.name,
      lastname: hozoriData.lastname,
      phoneNumber: hozoriData.phoneNumber,
      childrensCount: hozoriData.childrensCount || 0,
      maridgeStatus: hozoriData.maridgeStatus,
      Date: appointmentDate,
      time: hozoriData.time,
      paymentType: "direct",
      paymentDate: paymentDate || new Date(),
      paymentImage: "",
      userId: userId,
      status: "confirmed",
    });

    await hozoriReservation.save();

    return NextResponse.json({
      success: true,
      data: {
        id: hozoriReservation._id,
        status: hozoriReservation.status,
        Date: hozoriReservation.Date,
        time: hozoriReservation.time,
      },
    });
  } catch (error) {
    console.log("Error creating hozori from payment:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد رزرو" },
      { status: 500 }
    );
  }
}