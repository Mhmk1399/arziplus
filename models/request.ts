import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'dynamicServices', required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // User submitted form data
  
  // Customer information
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerEmail: { type: String }, // Cache customer email for quick access
  customerName: { type: String }, // Cache customer name for quick access
  
  // Request status tracking
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'in_progress', 'completed', 'rejected', 'cancelled', 'requires_info']
  },
  
  // Payment information
  isPaid: { type: Boolean, default: false },
  paymentAmount: { type: Number },
  paymentDate: { type: Date },
  paymentMethod: { type: String }, // 'wallet', 'card', etc.
  
  // Admin actions
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Which admin is handling this
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectedReason: { type: String },
  
  // Communication
  adminNotes: [{ 
    note: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    isVisibleToCustomer: { type: Boolean, default: false }
  }],
  
  // Progress tracking
  estimatedCompletionDate: { type: Date },
  actualCompletionDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  
  // Delivery/Result
  deliveredFiles: [{ 
    filename: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  deliveryNotes: { type: String }, // Final notes when delivering to customer
  
  // Metadata
  requestNumber: { type: String, unique: true }, // Human-readable request ID like "REQ-2024-001"
  
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Generate unique request number before saving
RequestSchema.pre('save', async function(next) {
  if (this.isNew && !this.requestNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Request.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.requestNumber = `REQ-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Index for better query performance
RequestSchema.index({ customer: 1, status: 1 });
RequestSchema.index({ assignedTo: 1, status: 1 });
RequestSchema.index({ requestNumber: 1 });

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
