import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dynamicServices",
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // User submitted form data

    // Customer information
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String }, // Cache customer name for quick access

    // Request status tracking
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "in_progress",
        "completed",
        "rejected",
        "cancelled",
        "requires_info",
      ],
    },

    // Payment information
    isPaid: { type: Boolean, default: false },
    paymentAmount: { type: Number },
    paymentDate: { type: Date },
    paymentMethod: { type: String }, // 'wallet', 'card', etc.
    paymentUrl: { type: String }, // For card payments or other external URLs

    // Admin actions
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Which admin is handling this
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectedReason: { type: String },

    // Communication
    adminNotes: [
      {
        note: { type: String },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
        isVisibleToCustomer: { type: Boolean, default: false },
      },
    ],

    // Progress tracking
    estimatedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Delivery/Result
    deliveredFiles: [
      {
        filename: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    deliveryNotes: { type: String }, // Final notes when delivering to customer

    // Metadata
    requestNumber: { type: String, unique: true, required: true }, // Human-readable request ID like "SERVICE-CARD-1234567890" or "LOTTERY-CARD-1234567890"
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
