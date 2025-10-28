import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    adminAnswer: { type: String },
    adminAttachments: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Tickets =
  mongoose.models.Tickets || mongoose.model("Tickets", ticketsSchema);

export default Tickets;
