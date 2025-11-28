import { NextRequest, NextResponse } from "next/server";
import {
  shabaValidation,
  cardValidation,
} from "@/lib/vakidateBankWithNationals";
import User from "@/models/users";
import connect from "@/lib/data";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

interface JWTPayload {
  id: string;
  phoneNumber: string;
}

interface UserData {
  _id: string;
  phoneNumber: string;
  nationalCredentials?: {
    nationalNumber: string;
    birthDate: string;
  };
}

/**
 * Extract user from JWT token
 */
async function getUserFromToken(request: NextRequest): Promise<UserData> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Authorization token is required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    await connect();

    const user = await User.findById(decoded.id).select(
      "phoneNumber nationalCredentials.nationalNumber nationalCredentials.birthDate"
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
}

/**
 * POST /api/verification/validate-banking
 * Validate SHEBA and card number with user's national code
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getUserFromToken(request);

    // Get request body
    const body = await request.json();
    const { cardNumber, shebaNumber } = body;

    if (!cardNumber && !shebaNumber) {
      return NextResponse.json(
        { error: "At least card number or SHEBA number is required" },
        { status: 400 }
      );
    }

    // Check if user has national credentials
    if (!user.nationalCredentials?.nationalNumber) {
      return NextResponse.json(
        {
          error: "National credentials not found",
          message: "لطفاً ابتدا اطلاعات ملی خود را تکمیل کنید",
          verified: false,
          requiresLogin: true,
        },
        { status: 400 }
      );
    }

    const nationalCode = user.nationalCredentials.nationalNumber;
    const birthDate =  "1371/1/1"

    const results = {
      cardVerified: false,
      shebaVerified: false,
      cardError: undefined as string | undefined,
      shebaError: undefined as string | undefined,
    };

    // Verify card if provided
    if (cardNumber) {
      const cardResult = await cardValidation(
        cardNumber,
        nationalCode,
        birthDate
      );
      console.log(cardResult,"catdResult")
      results.cardVerified = cardResult.verified;
      results.cardError = cardResult.error;
    }

    // Verify SHEBA if provided
    if (shebaNumber) {
      const shebaResult = await shabaValidation(
        shebaNumber,
        nationalCode,
        birthDate
      );
      console.log(shebaResult,"shebaResult")
      results.shebaVerified = shebaResult.verified;
      results.shebaError = shebaResult.error;
    }

    // Determine overall verification status
    const allVerified =
      (!cardNumber || results.cardVerified) &&
      (!shebaNumber || results.shebaVerified);

    return NextResponse.json({
      verified: allVerified,
      message: allVerified
        ? "اطلاعات بانکی با موفقیت تایید شد"
        : "اطلاعات بانکی با کد ملی شما مطابقت ندارد",
      details: {
        card: cardNumber
          ? {
              verified: results.cardVerified,
              error: results.cardError,
            }
          : undefined,
        sheba: shebaNumber
          ? {
              verified: results.shebaVerified,
              error: results.shebaError,
            }
          : undefined,
      },
      nationalCode: nationalCode.replace(/\d(?=\d{3})/g, "*"), // Masked for security
    });
  } catch (error) {
    console.error("Error in validate-banking:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        verified: false,
        message: "خطا در احراز هویت اطلاعات بانکی",
      },
      { status: 500 }
    );
  }
}
