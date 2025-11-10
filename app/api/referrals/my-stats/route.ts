import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/data";
import Referral from "@/models/Referral";
import ReferralReward from "@/models/ReferralReward";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

// GET - User's own referral statistics
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

    // Get user details
    const user = await User.findById(authUser.id).select("referralCode nationalCredentials");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 1. Referral Statistics
    const totalReferrals = await Referral.countDocuments({ referrer: authUser.id });
    const pendingReferrals = await Referral.countDocuments({
      referrer: authUser.id,
      status: "pending",
    });
    const completedReferrals = await Referral.countDocuments({
      referrer: authUser.id,
      status: "completed",
    });
    const rewardedReferrals = await Referral.countDocuments({
      referrer: authUser.id,
      status: "rewarded",
    });

    // 2. List of referrals with details
    const myReferrals = await Referral.find({ referrer: authUser.id })
      .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName contactInfo.email createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // 3. Total rewards earned
    const myRewards = await ReferralReward.find({ user: authUser.id })
      .populate({
        path: "referral",
        populate: {
          path: "referee",
          select: "nationalCredentials.firstName nationalCredentials.lastName"
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    const pendingRewards = myRewards.filter(r => r.status === "pending");
    const claimedRewards = myRewards.filter(r => r.status === "claimed");
    const expiredRewards = myRewards.filter(r => r.status === "expired");

    const totalRewardValue = claimedRewards.reduce((sum, r) => sum + r.value, 0);
    const pendingRewardValue = pendingRewards.reduce((sum, r) => sum + r.value, 0);

    // 4. Rewards breakdown by type
    const rewardsByType = myRewards.reduce((acc: any, reward) => {
      if (!acc[reward.rewardType]) {
        acc[reward.rewardType] = {
          count: 0,
          totalValue: 0,
          claimed: 0,
          pending: 0,
        };
      }
      acc[reward.rewardType].count++;
      acc[reward.rewardType].totalValue += reward.value;
      if (reward.status === "claimed") {
        acc[reward.rewardType].claimed++;
      } else if (reward.status === "pending") {
        acc[reward.rewardType].pending++;
      }
      return acc;
    }, {});

    // 5. Recent activity
    const recentActivity = await Referral.find({ referrer: authUser.id })
      .populate("referee", "nationalCredentials.firstName nationalCredentials.lastName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Referral link
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL_refral}/auth/sms?ref=${user.referralCode}`;

    // 7. Check if user was referred by someone
    const wasReferred = await Referral.findOne({ referee: authUser.id })
      .populate("referrer", "nationalCredentials.firstName nationalCredentials.lastName referralCode");

    return NextResponse.json({
      success: true,
      data: {
        userInfo: {
          referralCode: user.referralCode,
          referralLink,
          name: user.nationalCredentials?.firstName 
            ? `${user.nationalCredentials.firstName} ${user.nationalCredentials.lastName || ''}`
            : 'کاربر',
        },
        referralStats: {
          total: totalReferrals,
          pending: pendingReferrals,
          completed: completedReferrals,
          rewarded: rewardedReferrals,
        },
        rewardStats: {
          totalRewards: myRewards.length,
          pending: pendingRewards.length,
          claimed: claimedRewards.length,
          expired: expiredRewards.length,
          totalValue: totalRewardValue,
          pendingValue: pendingRewardValue,
          byType: rewardsByType,
        },
        referrals: myReferrals,
        rewards: myRewards,
        recentActivity,
        referredBy: wasReferred || null,
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
