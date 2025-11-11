import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import ReferralRewardRule from "@/models/ReferralRewardRule";
import { getAuthUser } from "@/lib/auth";

// GET - Retrieve reward rules (admin)
export async function GET(request: NextRequest) {
  try {
    await connect();

    // Get authenticated user and check admin role
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    if (!authUser.roles.includes("admin") && !authUser.roles.includes("superAdmin")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const actionType = searchParams.get("actionType");
    const isActive = searchParams.get("isActive");
    const serviceSlug = searchParams.get("serviceSlug");

    // Get single rule by ID
    if (id) {
      const rule = await ReferralRewardRule.findById(id);
      if (!rule) {
        return NextResponse.json(
          { success: false, error: "قانون پاداش یافت نشد" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: rule });
    }

    // Build filter
    const filter: any = {};
    if (actionType) filter.actionType = actionType;
    if (isActive !== null) filter.isActive = isActive === "true";
    if (serviceSlug) filter.serviceSlug = serviceSlug;

    const rules = await ReferralRewardRule.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: rules,
      count: rules.length,
    });
  } catch (error: any) {
    console.error("Error fetching reward rules:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت قوانین پاداش" },
      { status: 500 }
    );
  }
}

// POST - Create new reward rule (admin)
export async function POST(request: NextRequest) {
  try {
    await connect();

    // Get authenticated user and check admin role
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    if (!authUser.roles.includes("admin") && !authUser.roles.includes("superAdmin")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "actionType",
      "rewardType",
      "rewardAmount",
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `فیلد ${field} الزامی است` },
          { status: 400 }
        );
      }
    }

    // Validate actionType-specific requirements
    if (body.actionType === "dynamicServices" && !body.serviceSlug) {
      return NextResponse.json(
        { success: false, error: "serviceSlug برای dynamicServices الزامی است" },
        { status: 400 }
      );
    }

    // Validate rewardRecipient-specific fields
    if (body.rewardRecipient === "both") {
      if (!body.referrerRewardAmount || !body.refereeRewardAmount) {
        return NextResponse.json(
          { success: false, error: "مبالغ پاداش برای هر دو طرف الزامی است" },
          { status: 400 }
        );
      }
    }

    // Create reward rule
    const rewardRule = await ReferralRewardRule.create({
      ...body,
      createdBy: authUser.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "قانون پاداش با موفقیت ایجاد شد",
        data: rewardRule,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating reward rule:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد قانون پاداش" },
      { status: 500 }
    );
  }
}

// PUT - Update reward rule (admin)
export async function PUT(request: NextRequest) {
  try {
    await connect();

    // Get authenticated user and check admin role
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    if (!authUser.roles.includes("admin") && !authUser.roles.includes("superAdmin")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه قانون الزامی است" },
        { status: 400 }
      );
    }

    // Find and update
    const rewardRule = await ReferralRewardRule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!rewardRule) {
      return NextResponse.json(
        { success: false, error: "قانون پاداش یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "قانون پاداش با موفقیت به‌روزرسانی شد",
      data: rewardRule,
    });
  } catch (error: any) {
    console.error("Error updating reward rule:", error);
    return NextResponse.json(
      { success: false, error: "خطا در به‌روزرسانی قانون پاداش" },
      { status: 500 }
    );
  }
}

// DELETE - Delete reward rule (admin)
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    // Get authenticated user and check admin role
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    if (!authUser.roles.includes("admin") && !authUser.roles.includes("superAdmin")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه قانون الزامی است" },
        { status: 400 }
      );
    }

    const rewardRule = await ReferralRewardRule.findByIdAndDelete(id);

    if (!rewardRule) {
      return NextResponse.json(
        { success: false, error: "قانون پاداش یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "قانون پاداش با موفقیت حذف شد",
    });
  } catch (error: any) {
    console.error("Error deleting reward rule:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف قانون پاداش" },
      { status: 500 }
    );
  }
}
