/**
 * Script to retroactively process missing referral rewards
 * This should be run once to process rewards for transactions that happened
 * before the referral reward system was fully implemented
 */

import connect from "@/lib/data";
import Lottery from "@/models/lottery";
import { processReferralReward } from "@/lib/referralRewardProcessor";
import mongoose from "mongoose";

async function processLotteryRewards() {
  try {
    await connect();
    
    console.log("Starting to process missing lottery rewards...");
    
    // Find all paid lottery entries
    const paidLotteries = await Lottery.find({
      isPaid: true,
      paymentAmount: { $gt: 0 }
    }).sort({ createdAt: 1 });
    
    console.log(`Found ${paidLotteries.length} paid lottery entries`);
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const lottery of paidLotteries) {
      try {
        console.log(`\nProcessing lottery ${lottery._id} for user ${lottery.userId}`);
        
        const result = await processReferralReward({
          userId: lottery.userId,
          actionType: "lottery",
          transactionAmount: lottery.paymentAmount,
          transactionId: lottery._id.toString(),
        });
        
        if (result.success) {
          if (result.referrerReward || result.refereeReward) {
            console.log(`✓ Rewards processed: Referrer: ${result.referrerReward || 0}, Referee: ${result.refereeReward || 0}`);
            processed++;
          } else {
            console.log(`- No rewards (${result.message})`);
            skipped++;
          }
        } else {
          console.log(`✗ Error: ${result.message}`);
          errors++;
        }
      } catch (error) {
        console.error(`✗ Error processing lottery ${lottery._id}:`, error);
        errors++;
      }
    }
    
    console.log("\n=== Summary ===");
    console.log(`Total lotteries: ${paidLotteries.length}`);
    console.log(`Rewards processed: ${processed}`);
    console.log(`Skipped (no referral): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the script
processLotteryRewards();
