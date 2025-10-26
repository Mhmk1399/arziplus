import mongoose from "mongoose";
import Currency from "./curancy";

const ticketsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  adminAnswer: { type: String },
  status: {
    type: String,
    enum: ["open", "in_progress", "closed"],
    default: "open",
  },
});

const Tickets =
  mongoose.models.Tickets || mongoose.model("Tickets", ticketsSchema);

export default Tickets;
