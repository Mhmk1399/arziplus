import mongoose from "mongoose";

const HozoriSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  childrensCount: { type: Number, required: true, default: 0 },
  maridgeStatus: { 
    type: String, 
    required: true,
    enum: ['single', 'married']
  },
  Date: { type: Date, required: true },
  time: { type: String, required: true }, // Changed from Date to String for time slots
  paymentType: { 
    type: String, 
    required: true,
    enum: ['wallet', 'direct', 'card']
  },
  paymentDate: { type: Date, required: true },
  paymentImage: { type: String, default: "" },
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  adminNotes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Create compound index for date and time to ensure no double booking
HozoriSchema.index({ Date: 1, time: 1 }, { unique: true });

// Create index for user queries
HozoriSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Hozori || mongoose.model("Hozori", HozoriSchema);
