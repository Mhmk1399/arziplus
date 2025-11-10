// models/Referral.js
import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // a user can only be referred once
    },
    referralCode: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rewarded", "expired"],
      default: "pending",
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
 
    completedAt: {
      type: Date,
    },
    rewardedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);



export default mongoose.models.Referral || mongoose.model("Referral", referralSchema);
