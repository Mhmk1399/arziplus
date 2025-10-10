import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "غیر مجاز" },
        { status: 401 }
      );
    }

    await connect();

    const user = await User.findById(authUser.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: user.toObject()
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}