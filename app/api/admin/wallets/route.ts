import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import Wallet from "@/models/wallet";
import connect from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

async function getAdminUser(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    throw new Error("No token provided or invalid token");
  }

  await connect();
  const user = await User.findById(authUser.id);

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is admin
  if (!user.roles.includes("admin") && !user.roles.includes("super_admin")) {
    throw new Error("Access denied: Admin privileges required");
  }

  return user;
}

// GET - Get all wallets for admin
export async function GET(request: NextRequest) {
  try {
    await getAdminUser(request);
    await connect();

    // Get all wallets with user information
    const wallets = await Wallet.find({})
      .populate("userId", "username firstName lastName phone")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      wallets,
      count: wallets.length,
    });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch wallets",
      },
      { status: error instanceof Error && error.message.includes("Access denied") ? 403 : 500 }
    );
  }
}