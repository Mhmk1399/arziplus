import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  inComes: [
    {
      amount: { type: Number },
      tag: { type: String },
      description: { type: String },
      date: { type: Date, default: Date.now },
      verifiedAt: { type: Date },
      status: { type: String, enum: ["pending", "verified", "rejected"] },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  outComes: [
    {
      amount: { type: Number },
      tag: { type: String },
      description: { type: String },
      date: { type: Date, default: Date.now },
      verifiedAt: { type: Date },
      status: { type: String, enum: ["pending", "verified", "rejected"] },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  balance: [
    { amount: { type: Number, default: 0 }, updatedAt: { type: Date } },
  ],
});

export default mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);
