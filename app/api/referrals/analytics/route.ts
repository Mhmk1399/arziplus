import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Referral from "@/models/Referral";
import ReferralReward from "@/models/ReferralReward";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

// GET - Admin analytics for referral system
export async function GET(request: NextRequest) {
  try {
    await connect();

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Only admins can view analytics
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");

    // Build date filter if provided
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build user filter if provided
    const userFilter: any = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, message: "Invalid user ID format" },
          { status: 400 }
        );
      }
      userFilter.referrer = userId;
    }

    // Combine filters
    const referralFilter = { ...dateFilter, ...userFilter };

    // 1. Total Statistics
    const totalReferrals = await Referral.countDocuments(referralFilter);
    const pendingReferrals = await Referral.countDocuments({
      ...referralFilter,
      status: "pending",
    });
    const completedReferrals = await Referral.countDocuments({
      ...referralFilter,
      status: "completed",
    });
    const rewardedReferrals = await Referral.countDocuments({
      ...referralFilter,
      status: "rewarded",
    });
    const expiredReferrals = await Referral.countDocuments({
      ...referralFilter,
      status: "expired",
    });

    // 2. Reward Statistics
    const totalRewards = await ReferralReward.countDocuments(dateFilter);
    const pendingRewards = await ReferralReward.countDocuments({
      ...dateFilter,
      status: "pending",
    });
    const claimedRewards = await ReferralReward.countDocuments({
      ...dateFilter,
      status: "claimed",
    });
    const expiredRewards = await ReferralReward.countDocuments({
      ...dateFilter,
      status: "expired",
    });

    // 3. Total reward value distributed
    const rewardValueAgg = await ReferralReward.aggregate([
      { $match: { ...dateFilter, status: "claimed" } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
          avgValue: { $avg: "$value" },
        },
      },
    ]);

    const rewardValue = rewardValueAgg.length > 0 
      ? rewardValueAgg[0] 
      : { totalValue: 0, avgValue: 0 };

    // 4. Reward breakdown by type
    const rewardsByType = await ReferralReward.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$rewardType",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
        },
      },
    ]);

    // 5. Top referrers
    const topReferrers = await Referral.aggregate([
      { $match: referralFilter },
      {
        $group: {
          _id: "$referrer",
          totalReferrals: { $sum: 1 },
          completedReferrals: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          rewardedReferrals: {
            $sum: { $cond: [{ $eq: ["$status", "rewarded"] }, 1, 0] },
          },
          totalRewardAmount: { $sum: "$rewardAmount" },
        },
      },
      { $sort: { totalReferrals: -1 } },
      { $limit: 10 },
    ]);

    // Populate user details for top referrers
    const populatedTopReferrers = await User.populate(topReferrers, {
      path: "_id",
      select: "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email referralCode",
    });

    // 6. Referral trends over time (monthly)
    const referralTrends = await Referral.aggregate([
      { $match: referralFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          rewarded: {
            $sum: { $cond: [{ $eq: ["$status", "rewarded"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    // 7. Recent referrals
    const recentReferrals = await Referral.find(referralFilter)
      .populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName referralCode")
      .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // 8. Users with referral codes but no referrals
    const usersWithNoReferrals = await User.countDocuments({
      referralCode: { $exists: true, $ne: null },
      _id: { $nin: await Referral.distinct("referrer") },
    });

    // 9. Conversion rate (completed/total)
    const conversionRate = totalReferrals > 0 
      ? ((completedReferrals / totalReferrals) * 100).toFixed(2) 
      : "0.00";

    // 10. Average time to completion
    const completionTimeAgg = await Referral.aggregate([
      {
        $match: {
          ...referralFilter,
          status: { $in: ["completed", "rewarded"] },
          completedAt: { $exists: true },
        },
      },
      {
        $project: {
          daysToComplete: {
            $divide: [
              { $subtract: ["$completedAt", "$createdAt"] },
              1000 * 60 * 60 * 24, // Convert to days
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$daysToComplete" },
        },
      },
    ]);

    const avgCompletionDays = completionTimeAgg.length > 0
      ? completionTimeAgg[0].avgDays.toFixed(1)
      : "0";

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalReferrals,
          pendingReferrals,
          completedReferrals,
          rewardedReferrals,
          expiredReferrals,
          conversionRate: `${conversionRate}%`,
          avgCompletionDays: `${avgCompletionDays} days`,
          usersWithNoReferrals,
        },
        rewards: {
          totalRewards,
          pendingRewards,
          claimedRewards,
          expiredRewards,
          totalValueDistributed: rewardValue.totalValue,
          avgRewardValue: rewardValue.avgValue,
          rewardsByType,
        },
        topReferrers: populatedTopReferrers,
        trends: referralTrends,
        recentActivity: recentReferrals,
      },
    });
  } catch (error: unknown) {
    console.log("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
