import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import WithdrawRequest from "@/models/withdrawRequest";
import connect from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

interface QueryFilter {
  user?: string | { $in: string[] };
  status?: "pending" | "approved" | "rejected";
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
    $gt?: Date;
    $lt?: Date;
  };
}
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

// GET - Get all withdraw requests for admin
export async function GET(request: NextRequest) {
  try {
    await getAdminUser(request);
    await connect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // 'pending', 'approved', 'rejected'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search"); // username or phone search
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: QueryFilter = {};

    if (status && (status === "pending" || status === "approved" || status === "rejected")) {
      query.status = status;
    }

    // If search is provided, we need to find users first
    if (search) {
      const userQuery = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      };
      const matchingUsers = await User.find(userQuery, "_id");
      const userIds = matchingUsers.map((user) => user._id);
      query.user = { $in: userIds };
    }

    // Count total documents
    const total = await WithdrawRequest.countDocuments(query);

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Get paginated results with populated user data
    const withdrawRequests = await WithdrawRequest.find(query)
      .populate("user", "username firstName lastName phone")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate statistics
    const stats = {
      total: await WithdrawRequest.countDocuments(),
      pending: await WithdrawRequest.countDocuments({ status: "pending" }),
      approved: await WithdrawRequest.countDocuments({ status: "approved" }),
      rejected: await WithdrawRequest.countDocuments({ status: "rejected" }),
      totalAmount:
        (
          await WithdrawRequest.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
        )[0]?.total || 0,
      pendingAmount:
        (
          await WithdrawRequest.aggregate([
            { $match: { status: "pending" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
        )[0]?.total || 0,
    };

    return NextResponse.json({
      success: true,
      withdrawRequests,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching withdraw requests:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch withdraw requests",
      },
      {
        status:
          error instanceof Error && error.message.includes("Access denied")
            ? 403
            : 500,
      }
    );
  }
}
