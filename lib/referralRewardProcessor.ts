import connect from "@/lib/data";
import ReferralRewardRule, { IReferralRewardRule } from "@/models/ReferralRewardRule";
import Referral from "@/models/Referral";
import ReferralReward from "@/models/ReferralReward";
import User from "@/models/users";

interface ProcessRewardParams {
  userId: string;
  actionType: "lottery" | "dynamicServices" | "hozori" | "payment" | "signup";
  serviceSlug?: string;
  transactionAmount: number;
  transactionId?: string;
}

interface ProcessRewardResult {
  success: boolean;
  referrerReward?: number;
  refereeReward?: number;
  message?: string;
}

/**
 * Process referral rewards based on defined rules
 * This function checks if a user was referred and processes rewards accordingly
 */
export async function processReferralReward(
  params: ProcessRewardParams
): Promise<ProcessRewardResult> {
  try {
    await connect();

    const { userId, actionType, serviceSlug, transactionAmount, transactionId } = params;

    console.log("=== REFERRAL REWARD PROCESSING STARTED ===");
    console.log("Parameters:", JSON.stringify(params, null, 2));

    // Find if this user was referred by someone (accept both pending and completed)
    const referral = await Referral.findOne({ 
      referee: userId, 
      status: { $in: ["pending", "completed"] }
    });
    
    console.log("Referral lookup for userId:", userId);
    console.log("Referral found:", referral ? JSON.stringify(referral, null, 2) : "NO REFERRAL");
    
    if (!referral) {
      // User was not referred, no reward to process
      console.log("=== NO REFERRAL FOUND - SKIPPING REWARDS ===");
      return { success: true, message: "No referral found" };
    }

    // Mark referral as completed if it's still pending (first successful action)
    if (referral.status === "pending") {
      console.log("Marking referral as completed (was pending)");
      referral.status = "completed";
      await referral.save();
      console.log(`Referral ${referral._id} marked as completed`);
    }

    // Build filter to find applicable reward rules
    const ruleFilter: data = {
      actionType,
      isActive: true,
    };

    // If it's a dynamicServices action, filter by serviceSlug
    if (actionType === "dynamicServices" && serviceSlug) {
      ruleFilter.serviceSlug = serviceSlug;
    }

    console.log("Searching for reward rules with filter:", JSON.stringify(ruleFilter, null, 2));

    // Find active reward rules for this action type
    const rules = await ReferralRewardRule.find(ruleFilter);

    console.log(`Found ${rules.length} reward rule(s)`);
    if (rules.length > 0) {
      console.log("Rules:", JSON.stringify(rules, null, 2));
    }

    if (rules.length === 0) {
      console.log("=== NO ACTIVE REWARD RULES FOUND ===");
      return { success: true, message: "No active reward rules found" };
    }

    let totalReferrerReward = 0;
    let totalRefereeReward = 0;

    console.log("=== PROCESSING RULES ===");

    // Process each applicable rule
    for (const rule of rules) {
      console.log(`\n--- Checking rule: ${rule.name} (${rule._id}) ---`);
      
      // Check if rule is valid (time-based, usage limits, etc.)
      const isValid = rule.isValid();
      console.log(`Rule isValid: ${isValid}`);
      if (!isValid) {
        console.log("Rule validation failed - skipping");
        continue;
      }

      // Check minimum transaction amount
      console.log(`Checking minAmount: rule.minAmount=${rule.minAmount}, transactionAmount=${transactionAmount}`);
      if (rule.minAmount && transactionAmount < rule.minAmount) {
        console.log("Transaction amount below minimum - skipping");
        continue;
      }

      // Check per-user usage limit
      if (rule.maxUsesPerUser) {
        const userRewardCount = await ReferralReward.countDocuments({
          referral: referral._id,
          ruleId: rule._id,
        });

        console.log(`Usage check: userRewardCount=${userRewardCount}, maxUsesPerUser=${rule.maxUsesPerUser}`);
        if (userRewardCount >= rule.maxUsesPerUser) {
          console.log("User has reached usage limit for this rule - skipping");
          continue; // User has reached the limit for this rule
        }
      }

      // Calculate reward amounts
      const { referrerReward, refereeReward } = rule.calculateReward(transactionAmount);
      console.log(`Calculated rewards: referrerReward=${referrerReward}, refereeReward=${refereeReward}`);

      // Create reward records
      const rewardData = {
        referral: referral._id,
        referrer: referral.referrer,
        referee: referral.referee,
        ruleId: rule._id,
        actionType,
        serviceSlug,
        transactionAmount,
        transactionId,
        status: "pending" as const,
      };

      console.log("Creating reward records...",rewardData);

      // Create reward for referrer if applicable
      if (referrerReward > 0) {
        console.log(`Creating referrer reward: ${referrerReward} for user ${referral.referrer}`);
        await ReferralReward.create({
          referral: referral._id,
          user: referral.referrer,
          rewardType: "wallet_credit",
          value: referrerReward,
          status: "pending",
        });

        totalReferrerReward += referrerReward;
      }

      // Create reward for referee if applicable
      if (refereeReward > 0) {
        console.log(`Creating referee reward: ${refereeReward} for user ${referral.referee}`);
        await ReferralReward.create({
          referral: referral._id,
          user: referral.referee,
          rewardType: "wallet_credit",
          value: refereeReward,
          status: "pending",
        });

        totalRefereeReward += refereeReward;
      }

      // Increment rule usage counter
      console.log("Incrementing rule usage counter");
      await ReferralRewardRule.findByIdAndUpdate(rule._id, {
        $inc: { currentTotalUses: 1 },
      });

      // Update referral's total rewards
      console.log("Updating referral total rewards");
      await Referral.findByIdAndUpdate(referral._id, {
        $inc: { totalRewards: referrerReward + refereeReward },
      });

      console.log(`Rule ${rule.name} processed successfully`);
    }

    console.log("\n=== REFERRAL REWARD PROCESSING COMPLETED ===");
    console.log(`Total Referrer Reward: ${totalReferrerReward}`);
    console.log(`Total Referee Reward: ${totalRefereeReward}`);

    return {
      success: true,
      referrerReward: totalReferrerReward,
      refereeReward: totalRefereeReward,
      message: `Rewards processed successfully`,
    };
  } catch (error) {
    console.error("=== ERROR IN REFERRAL REWARD PROCESSING ===");
    console.error("Error details:", error);
    return {
      success: false,
      message: `Error processing reward: ${error}`,
    };
  }
}

/**
 * Get applicable reward rules for an action
 * Useful for showing potential rewards to users before they complete an action
 */


interface data{
  actionType: string;
  isActive: boolean;
  serviceSlug?: string;
}
export async function getApplicableRewardRules(
  actionType: string,
  serviceSlug?: string
): Promise<IReferralRewardRule[]> {
  try {
    await connect();

    const filter: data = {
      actionType,
      isActive: true,
    };

    if (actionType === "dynamicServices" && serviceSlug) {
      filter.serviceSlug = serviceSlug;
    }

    const rules = await ReferralRewardRule.find(filter);
    
    // Filter to only include currently valid rules
    return rules.filter(rule => rule.isValid());
  } catch (error) {
    console.error("Error fetching applicable rules:", error);
    return [];
  }
}

/**
 * Check if a user is eligible for referral rewards
 */
export async function isUserEligibleForRewards(userId: string): Promise<boolean> {
  try {
    await connect();
    
    const referral = await Referral.findOne({ 
      referee: userId, 
      status: { $in: ["pending", "completed"] }
    });
    
    return !!referral;
  } catch (error) {
    console.error("Error checking user eligibility:", error);
    return false;
  }
}
