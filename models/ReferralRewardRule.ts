import mongoose, { Schema, Document } from "mongoose";

export interface IReferralRewardRule extends Document {
  name: string;
  description?: string;
  actionType: "lottery" | "dynamicServices" | "hozori" | "payment" | "signup";
  serviceSlug?: string; // For dynamicServices - which specific service
  isActive: boolean;
  
  // Reward configuration
  rewardType: "wallet" | "percentage" | "fixed";
  rewardAmount: number; // Fixed amount or percentage value
  rewardCurrency: string;
  
  // Conditions
  minAmount?: number; // Minimum transaction amount to trigger reward
  maxRewardAmount?: number; // Cap for percentage-based rewards
  
  // Limits
  maxUsesPerUser?: number; // How many times a user can trigger this reward
  maxTotalUses?: number; // Total uses across all users
  currentTotalUses: number;
  
  // Who gets the reward
  rewardRecipient: "referrer" | "referee" | "both";
  referrerRewardAmount?: number; // If both, separate amounts
  refereeRewardAmount?: number;
  
  // Validity period
  validFrom?: Date;
  validUntil?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

const ReferralRewardRuleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    actionType: {
      type: String,
      enum: ["lottery", "dynamicServices", "hozori", "payment", "signup"],
      required: true,
    },
    serviceSlug: {
      type: String,
      trim: true,
      // Required if actionType is dynamicServices
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rewardType: {
      type: String,
      enum: ["wallet", "percentage", "fixed"],
      required: true,
    },
    rewardAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  
    minAmount: {
      type: Number,
      min: 0,
    },
    maxRewardAmount: {
      type: Number,
      min: 0,
    },
    maxUsesPerUser: {
      type: Number,
      min: 1,
    },
    maxTotalUses: {
      type: Number,
      min: 1,
    },
    currentTotalUses: {
      type: Number,
      default: 0,
    },
    rewardRecipient: {
      type: String,
      enum: ["referrer", "referee", "both"],
      default: "referrer",
    },
    referrerRewardAmount: {
      type: Number,
      min: 0,
    },
    refereeRewardAmount: {
      type: Number,
      min: 0,
    },
    validFrom: {
      type: Date,
    },
    validUntil: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ReferralRewardRuleSchema.index({ actionType: 1, isActive: 1 });
ReferralRewardRuleSchema.index({ serviceSlug: 1, isActive: 1 });
ReferralRewardRuleSchema.index({ validFrom: 1, validUntil: 1 });

// Method to check if rule is currently valid
ReferralRewardRuleSchema.methods.isValid = function (this: IReferralRewardRule): boolean {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.validFrom && this.validFrom > now) return false;
  if (this.validUntil && this.validUntil < now) return false;
  
  if (this.maxTotalUses && this.currentTotalUses >= this.maxTotalUses) return false;
  
  return true;
};

// Method to calculate reward amount
ReferralRewardRuleSchema.methods.calculateReward = function (
  this: IReferralRewardRule,
  transactionAmount: number
): { referrerReward: number; refereeReward: number } {
  let baseReward = 0;
  
  if (this.rewardType === "fixed") {
    baseReward = this.rewardAmount;
  } else if (this.rewardType === "percentage") {
    baseReward = (transactionAmount * this.rewardAmount) / 100;
    if (this.maxRewardAmount && baseReward > this.maxRewardAmount) {
      baseReward = this.maxRewardAmount;
    }
  } else if (this.rewardType === "wallet") {
    baseReward = this.rewardAmount;
  }
  
  if (this.rewardRecipient === "referrer") {
    return { referrerReward: baseReward, refereeReward: 0 };
  } else if (this.rewardRecipient === "referee") {
    return { referrerReward: 0, refereeReward: baseReward };
  } else if (this.rewardRecipient === "both") {
    return {
      referrerReward: this.referrerRewardAmount || baseReward / 2,
      refereeReward: this.refereeRewardAmount || baseReward / 2,
    };
  }
  
  return { referrerReward: 0, refereeReward: 0 };
};

const ReferralRewardRule =
  mongoose.models.ReferralRewardRule ||
  mongoose.model<IReferralRewardRule>("ReferralRewardRule", ReferralRewardRuleSchema);

export default ReferralRewardRule;
