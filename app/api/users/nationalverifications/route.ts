import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

interface SearchQuery {
  _id?: string;
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  "nationalCredentials.lastName"?: { $regex: string; $options: string };
  "nationalCredentials.nationalNumber"?: { $regex: string; $options: string };
  "nationalCredentials.firstName"?:
    | { $exists: boolean; $ne?: string }
    | { $regex: string; $options: string };
  "verifications.identity.status"?: string;
}

interface UpdateQuery {
  "verifications.identity.status"?: string;
  "verifications.identity.reviewedAt"?: Date;
  "verifications.identity.reviewedBy"?: string;
  "verifications.identity.rejectionReason"?: string;
  "nationalCredentials.status"?: string;
  "nationalCredentials.rejectionNotes"?: string;
  status?: string;
  $unset?: {
    "verifications.identity.rejectionReason"?: string;
    "nationalCredentials.rejectionNotes"?: string;
  };
}

 

interface NationalCredentialsData {
  firstName: string;
  lastName: string;
  nationalNumber: string;
  nationalCardImageUrl?: string;
  verificationImageUrl?: string;
  status?: "pending_verification" | "accepted" | "rejected";
}

interface VerificationData {
  status: "not_submitted" | "pending" | "approved" | "rejected";
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface UserDocument {
  _id: string;
  nationalCredentials?: NationalCredentialsData;
  verifications: {
    identity: VerificationData;
  };
  status: string;
}

interface GetCredentialsResponse {
  credentials: UserDocument[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface PostCredentialsRequest {
  userId?: string;
  firstName: string;
  lastName: string;
  nationalNumber: string;
  nationalCardImageUrl?: string;
  verificationImageUrl?: string;
}

interface PostCredentialsResponse {
  message: string;
  nationalCredentials: NationalCredentialsData;
  verificationStatus: VerificationData;
}

interface PatchVerificationRequest {
  userId: string;
  status: "not_submitted" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

interface PatchVerificationResponse {
  message: string;
  verificationStatus: VerificationData;
  userStatus: string;
}

interface ErrorResponse {
  error: string;
}
// GET - Fetch national credentials with pagination and filtering
export async function GET(request: NextRequest): Promise<NextResponse<GetCredentialsResponse | ErrorResponse>> {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can view all users' credentials
    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const verificationStatus = searchParams.get("status") || "";
    const userId = searchParams.get("userId") || "";

    await connect();

    // Build query
    const query: SearchQuery = {};

    // Filter by specific user
    if (userId) {
      query._id = userId;
    }

    // Search by name or national number
    if (search) {
      query.$or = [
        { "nationalCredentials.firstName": { $regex: search, $options: "i" } },
        { "nationalCredentials.lastName": { $regex: search, $options: "i" } },
        {
          "nationalCredentials.nationalNumber": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by verification status
    if (verificationStatus) {
      query["verifications.identity.status"] = verificationStatus;
    }

    // Only include users with national credentials
    query["nationalCredentials.firstName"] = { $exists: true, $ne: "" };

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select(
          "nationalCredentials verifications.identity createdAt updatedAt"
        )
        .sort({ "verifications.identity.submittedAt": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    const response: GetCredentialsResponse = {
      credentials: users as unknown as UserDocument[],
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get national credentials error:", error);
    const errorResponse: ErrorResponse = { error: "خطای سرور" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST - Create or update national credentials
export async function POST(request: NextRequest): Promise<NextResponse<PostCredentialsResponse | ErrorResponse>> {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const requestData: PostCredentialsRequest = await request.json();
    const {
      userId,
      firstName,
      lastName,
      nationalNumber,
      nationalCardImageUrl,
      verificationImageUrl,
    } = requestData;

    // Validate required fields
    if (!firstName || !lastName || !nationalNumber) {
      return NextResponse.json(
        { error: "نام، نام خانوادگی و کد ملی الزامی هستند" },
        { status: 400 }
      );
    }

    // Validate national number format
    if (!/^\d{10}$/.test(nationalNumber)) {
      return NextResponse.json(
        { error: "کد ملی باید 10 رقم باشد" },
        { status: 400 }
      );
    }

    // Validate national number checksum
    const digits = nationalNumber.split("").map(Number);
    const checksum =
      digits.reduce((sum: number, digit: number, index: number) => {
        if (index < 9) return sum + digit * (10 - index);
        return sum;
      }, 0) % 11;

    const lastDigit = digits[9];
    const isValidNationalNumber =
      checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;

    if (!isValidNationalNumber) {
      return NextResponse.json({ error: "کد ملی معتبر نیست" }, { status: 400 });
    }

    await connect();

    // Determine target user
    const targetUserId = userId || authUser.id;
    const isOwnProfile = authUser.id === targetUserId;
    const isAdmin =
      authUser.roles.includes("admin") ||
      authUser.roles.includes("super_admin");

    // Check permissions
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Check if national number already exists (for other users)
    const existingUser = await User.findOne({
      "nationalCredentials.nationalNumber": nationalNumber,
      _id: { $ne: targetUserId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این کد ملی قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    // Prepare update data
    const nationalCredentials: NationalCredentialsData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalNumber,
      nationalCardImageUrl:
        nationalCardImageUrl ||
        user.nationalCredentials?.nationalCardImageUrl ||
        "",
      verificationImageUrl:
        verificationImageUrl ||
        user.nationalCredentials?.verificationImageUrl ||
        "",
      status: "pending_verification", // Default status for new/updated credentials
    };

    // Update verification status
    const verificationUpdate: Record<string, unknown> = {
      nationalCredentials: nationalCredentials,
      "verifications.identity.submittedAt": new Date(),
    };

    // If images are provided, set status to pending
    if (nationalCardImageUrl && verificationImageUrl) {
      verificationUpdate["verifications.identity.status"] = "pending";
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: verificationUpdate },
      { new: true, runValidators: true }
    ).select("nationalCredentials verifications.identity");

    if (!updatedUser) {
      return NextResponse.json({ error: "خطا در به‌روزرسانی کاربر" }, { status: 500 });
    }

    const response: PostCredentialsResponse = {
      message: "اطلاعات هویتی با موفقیت ثبت شد",
      nationalCredentials: updatedUser.nationalCredentials,
      verificationStatus: updatedUser.verifications.identity,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Create national credentials error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errorResponse: ErrorResponse = { error: "داده‌های ورودی نامعتبر" };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const errorResponse: ErrorResponse = { error: "خطای سرور" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PATCH - Update verification status (admin only)
export async function PATCH(request: NextRequest): Promise<NextResponse<PatchVerificationResponse | ErrorResponse>> {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Only admins can update verification status
    if (
      !authUser.roles.includes("admin") &&
      !authUser.roles.includes("super_admin")
    ) {
      return NextResponse.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    const requestData: PatchVerificationRequest = await request.json();
    const { userId, status, rejectionReason } = requestData;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "شناسه کاربر و وضعیت الزامی هستند" },
        { status: 400 }
      );
    }

    const validStatuses = ["not_submitted", "pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { error: "دلیل رد الزامی است" },
        { status: 400 }
      );
    }

    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Prepare update data
    const updateData: UpdateQuery = {
      "verifications.identity.status": status,
      "verifications.identity.reviewedAt": new Date(),
      "verifications.identity.reviewedBy": authUser.id,
      "nationalCredentials.status":
        status === "approved"
          ? "accepted"
          : status === "rejected"
          ? "rejected"
          : "pending_verification",
    };

    if (status === "rejected" && rejectionReason) {
      updateData["verifications.identity.rejectionReason"] = rejectionReason;
      updateData["nationalCredentials.rejectionNotes"] = rejectionReason;
    } else {
      updateData["$unset"] = {
        "verifications.identity.rejectionReason": "",
        "nationalCredentials.rejectionNotes": "",
      };
    }

    // Update user status based on verification
    if (status === "approved") {
      updateData.status = "active";
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("nationalCredentials verifications.identity status");

    if (!updatedUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const response: PatchVerificationResponse = {
      message: "وضعیت تایید با موفقیت به‌روزرسانی شد",
      verificationStatus: updatedUser.verifications.identity,
      userStatus: updatedUser.status,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Update verification status error:", error);
    const errorResponse: ErrorResponse = { error: "خطای سرور" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
