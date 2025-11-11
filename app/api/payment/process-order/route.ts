import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Payment from "@/models/payment";
import Request from "@/models/request";
import Lottery from "@/models/lottery";
import Wallet from "@/models/wallet";
import Hozori from "@/models/hozori";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/auth";

// Helper function to extract user ID from JWT token
interface payment {
  metadata: {
    serviceData: string;
    serviceId: string;
    customerName: string;
    lotteryData: string;
    hozoriData: string;
    customerPhone: string;
  };
  serviceId: string;
  userId: string;
  amount: number;
  description: string;
  currency: string;
  orderId: string;
  authority: string;
  status: string;
  zarinpalMessage: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt: Date;
  _id: string;
  __v: number;
}

interface hozoridata {
  Date?: string | Date;
  name?: string;
  lastname?: string;
  childrensCount?: number;
  phoneNumber?: number | string;
  maridgeStatus?: string;
  time?: string;
  // nested reservation data (optional)
  reservationData?: {
    Date?: string | Date;
    name?: string;
    lastname?: string;
    childrensCount?: number;
    maridgeStatus?: string;
    time?: string;
    phoneNumber?: number | string;
    [key: string]: unknown;
  };
  [key: string]: unknown; // allow extra keys such as imageUrl
}

// Types for lottery form data (avoid using `any`)
interface BirthDate {
  year?: string;
  month?: string;
  day?: string;
}

interface InitialInformations {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: BirthDate;
  country?: string;
  city?: string;
  citizenshipCountry?: string;
  [key: string]: unknown;
}

interface Residence {
  residanceCountry?: string;
  residanceCity?: string;
  residanseState?: string;
  postalCode?: string;
  residanseAdress?: string;
  [key: string]: unknown;
}

interface Contact {
  activePhoneNumber?: string;
  secondaryPhoneNumber?: string;
  email?: string;
  [key: string]: unknown;
}

interface OtherInfo {
  persianName?: string;
  persianLastName?: string;
  lastDegree?: string;
  partnerCitizenShip?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface Person {
  initialInformations?: InitialInformations;
  residanceInformation?: Residence[];
  contactInformations?: Contact[];
  otherInformations?: OtherInfo[];
  [key: string]: unknown;
}

interface FamilyInfo {
  maridgeState?: boolean;
  numberOfChildren?: number;
  towPeopleRegistration?: boolean;
  [key: string]: unknown;
}

interface LotteryFormData {
  famillyInformations?: FamilyInfo[];
  registererInformations?: Person[];
  registererPartnerInformations?: Person[];
  registererChildformations?: Person[];
  [key: string]: unknown;
}

// Helper function to generate unique request number
export async function POST(request: NextRequest) {
  try {
    await connect();

    // Extract and verify JWT token
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader);

    const authUser = getAuthUser(request);
    console.log("Auth user:", authUser);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          debug: {
            hasAuthHeader: !!authHeader,
            authHeaderValue: authHeader ? "Bearer [token]" : "missing",
          },
        },
        { status: 401 }
      );
    }

    const { authority, hozoriData, lotteryData } = await request.json();

    if (!authority) {
      return NextResponse.json(
        { success: false, error: "کد پیگیری ارائه نشده است" },
        { status: 400 }
      );
    }

    // Find the payment by authority
    const payment = await Payment.findOne({ authority });
    if (!payment) {
      return NextResponse.json(
        { success: false, error: "پرداخت یافت نشد" },
        { status: 404 }
      );
    }

    // Check if payment is verified
    if (payment.status !== "verified") {
      return NextResponse.json(
        { success: false, error: "پرداخت تایید نشده است" },
        { status: 400 }
      );
    }

    // Check if the payment belongs to the current user
    if (payment.userId.toString() !== authUser.id) {
      return NextResponse.json(
        { success: false, error: "عدم دسترسی به این پرداخت" },
        { status: 403 }
      );
    }

    // Determine payment type from orderId prefix
    const orderId = payment.orderId;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "شناسه سفارش یافت نشد" },
        { status: 400 }
      );
    }

    let result = null;

    if (orderId.startsWith("SERVICE-")) {
      // Create service request
      result = await createServiceRequest(payment, authUser.id);
    } else if (orderId.startsWith("LOTTERY-")) {
      // Create lottery registration
      result = await createLotteryRegistration(
        payment,
        authUser.id,
        lotteryData
      );
    } else if (
      orderId.startsWith("WALLET-") ||
      (payment.description.includes("شارژ کیف پول") &&
        !orderId.startsWith("HOZORI-")) ||
      (payment.description.includes("شارژ") &&
        !orderId.startsWith("HOZORI-")) ||
      (payment.metadata?.type === "wallet_charge" &&
        !orderId.startsWith("HOZORI-")) ||
      (!payment.serviceId && !orderId.startsWith("HOZORI-"))
    ) {
      // Create wallet charge - only for actual wallet charges, not hozori payments
      result = await createWalletCharge(payment, authUser.id);
    } else if (orderId.startsWith("HOZORI-")) {
      // Handle hozori (in-person) requests
      result = await createHozoriReservation(payment, authUser.id, hozoriData);
    } else {
      return NextResponse.json(
        { success: false, error: "نوع پرداخت شناسایی نشد" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "سفارش با موفقیت ایجاد شد",
    });
  } catch (error) {
    console.log("Process order error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش سفارش" },
      { status: 500 }
    );
  }
}

async function createServiceRequest(payment: payment, userId: string) {
  try {
    // Get service data from payment metadata
    const serviceData = payment.metadata?.serviceData
      ? JSON.parse(payment.metadata.serviceData)
      : {};

    if (!payment.serviceId) {
      throw new Error("شناسه سرویس یافت نشد");
    }

    // Use the orderId as requestNumber (e.g., SERVICE-CARD-1234567890)
    const requestNumber = payment.orderId;

    // Create service request
    const serviceRequest = new Request({
      service: new mongoose.Types.ObjectId(payment.serviceId),
      data: serviceData,
      customer: new mongoose.Types.ObjectId(userId),
      customerName: payment.metadata?.customerName || "کاربر",
      status: "pending",
      isPaid: true,
      paymentAmount: payment.amount,
      paymentDate: payment.verifiedAt || new Date(),
      paymentMethod: "direct",
      requestNumber,
      priority: "medium",
    });

    await serviceRequest.save();

    return {
      type: "service",
      id: serviceRequest._id,
      requestNumber: serviceRequest.requestNumber,
      status: serviceRequest.status,
    };
  } catch (error) {
    console.log("Error creating service request:", error);
    throw error;
  }
}

async function createLotteryRegistration(
  payment: payment,
  userId: string,
  lotteryData?: LotteryFormData
) {
  try {
    // Use provided lotteryData or try to get from metadata
    let registrationData: LotteryFormData | undefined;

    // If lotteryData was passed in and looks like an object, use it
    if (lotteryData && typeof lotteryData === "object") {
      registrationData = lotteryData;
    }

    // Otherwise try to parse from payment metadata safely
    if (!registrationData && payment.metadata?.lotteryData) {
      try {
        const parsed: unknown = JSON.parse(payment.metadata.lotteryData);
        if (parsed && typeof parsed === "object") {
          registrationData = parsed as LotteryFormData;
        }
      } catch   {
        console.log("Failed to parse lotteryData from metadata");
      }
    }

    if (!registrationData) {
      throw new Error("اطلاعات قرعه کشی یافت نشد");
    }

    // Normalize registrationData to ensure required sections exist so Mongoose save won't fail
    const defaultPerson = () => ({
      initialInformations: {
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: { year: "", month: "", day: "" },
        country: "",
        city: "",
        citizenshipCountry: "",
      },
      residanceInformation: [
        {
          residanceCountry: "",
          residanceCity: "",
          residanseState: "",
          postalCode: "",
          residanseAdress: "",
        },
      ],
      contactInformations: [
        { activePhoneNumber: "", secondaryPhoneNumber: "", email: "" },
      ],
      otherInformations: [
        {
          persianName: "",
          persianLastName: "",
          lastDegree: "",
          partnerCitizenShip: "",
          imageUrl: "",
        },
      ],
    });

    const reg = {
      famillyInformations:
        registrationData.famillyInformations &&
        registrationData.famillyInformations.length
          ? registrationData.famillyInformations
          : [
              {
                maridgeState: false,
                numberOfChildren: 0,
                towPeopleRegistration: false,
              },
            ],
      registererInformations:
        registrationData.registererInformations &&
        registrationData.registererInformations.length
          ? registrationData.registererInformations
          : [defaultPerson()],
      registererPartnerInformations:
        registrationData.registererPartnerInformations &&
        registrationData.registererPartnerInformations.length
          ? registrationData.registererPartnerInformations
          : [],
      registererChildformations:
        registrationData.registererChildformations &&
        registrationData.registererChildformations.length
          ? registrationData.registererChildformations
          : [],
      // include any other top-level fields from incoming data (like payment info overrides)
      ...registrationData,
    };

    // Create lottery registration
    const lotteryRegistration = new Lottery({
      userId: userId,
      status: "pending",
      paymentMethod: "direct",
      paymentAmount: payment.amount,
      isPaid: true,
      paymentDate: payment.verifiedAt || new Date(),
      // Copy normalized lottery form data
      ...reg,
      submittedAt: new Date(),
    });

    await lotteryRegistration.save();

    return {
      type: "lottery",
      id: lotteryRegistration._id,
      status: lotteryRegistration.status,
    };
  } catch (error) {
    console.log("Error creating lottery registration:", error);
    throw error;
  }
}

async function createWalletCharge(payment: payment, userId: string) {
  try {
    // Find or create user wallet
    let wallet = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!wallet) {
      wallet = new Wallet({
        userId: new mongoose.Types.ObjectId(userId),
        inComes: [],
        outComes: [],
        balance: [{ amount: 0, updatedAt: new Date() }],
      });
    }

    // Add income transaction
    wallet.inComes.push({
      amount: payment.amount,
      tag: "شارژ",
      description: `شارژ کیف پول - کد پیگیری: ${payment.authority}`,
      date: payment.verifiedAt || new Date(),
      verifiedAt: payment.verifiedAt || new Date(),
      status: "verified",
      verifiedBy: new mongoose.Types.ObjectId(userId), // Self-verified through payment
    });

    // Update balance
    const currentBalance =
      wallet.balance.length > 0
        ? wallet.balance[wallet.balance.length - 1].amount
        : 0;

    wallet.balance.push({
      amount: currentBalance + payment.amount,
      updatedAt: new Date(),
    });

    await wallet.save();

    return {
      type: "wallet",
      id: wallet._id,
      amount: payment.amount,
      newBalance: currentBalance + payment.amount,
    };
  } catch (error) {
    console.log("Error creating wallet charge:", error);
    throw error;
  }
}

async function createHozoriReservation(
  payment: payment,
  userId: string,
  hozoriData?: hozoridata
) {
  try {
    // Use provided hozoriData or try to get from metadata
    let reservationData: hozoridata | undefined = hozoriData;

    if (!reservationData && payment.metadata?.hozoriData) {
      try {
        reservationData = JSON.parse(payment.metadata.hozoriData);
      } catch   {
        console.log("Failed to parse hozoriData from metadata");
      }
    }

    // Build a normalized local 'res' object with defaults to avoid TS 'possibly undefined' errors
    const customerName = payment.metadata?.customerName || "کاربر";
    const [defaultName, defaultLastname] = customerName.split(" ");

    const res: hozoridata = {
      name: reservationData?.name || defaultName || "کاربر",
      lastname: reservationData?.lastname || defaultLastname || "",
      phoneNumber:
        reservationData?.phoneNumber || payment.metadata?.customerPhone || "",
      childrensCount: reservationData?.childrensCount || 0,
      maridgeStatus: reservationData?.maridgeStatus || "single",
      Date:
        reservationData?.Date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: reservationData?.time || "09:00",
      ...(reservationData || {}),
    };

    // Parse the date from res.Date
    let appointmentDate: Date;
    if (res.Date) {
      appointmentDate = new Date(res.Date as string | Date);
    } else {
      appointmentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Create hozori reservation
    const hozoriReservation = new Hozori({
      name: res.name,
      lastname: res.lastname,
      phoneNumber: res.phoneNumber,
      childrensCount: res.childrensCount || 0,
      maridgeStatus: res.maridgeStatus,
      Date: appointmentDate,
      time: res.time,
      paymentType: "direct",
      paymentDate: payment.verifiedAt || new Date(),
      paymentImage: "",
      userId: userId,
      status: "confirmed",
    });

    await hozoriReservation.save();

    return {
      type: "hozori",
      id: hozoriReservation._id,
      status: hozoriReservation.status,
      appointmentDate: appointmentDate,
      time: res.time,
    };
  } catch (error) {
    console.log("Error creating hozori reservation:", error);
    throw error;
  }
}
