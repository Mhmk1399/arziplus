// models/ReferralReward.js
import mongoose from "mongoose";

const referralRewardSchema = new mongoose.Schema(
  {
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rewardType: {
      type: String,
      enum: ["wallet_credit", "discount", "service_upgrade"],
      default: "wallet_credit",
    },
    value: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "claimed", "expired"],
      default: "pending",
    },
    claimedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ReferralReward || mongoose.model("ReferralReward", referralRewardSchema);
