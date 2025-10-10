import mongoose from "mongoose";

// Banking Information Schema
const bankingInfoSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true
  },
  cardNumber: {
    type: String,
    trim: true
  },
  shebaNumber: {
    type: String,
    trim: true,
    match: [/^IR\d{24}$/, 'Invalid SHEBA number format']
  },
  accountHolderName: {
    type: String,
    trim: true
  }
}, { _id: true });

// National Credentials Schema
const nationalCredentialsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  nationalNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^\d{10}$/, 'National number must be 10 digits']
  },
  nationalCardImageUrl: {
    type: String,
    trim: true
  },
  verificationImageUrl: {
    type: String,
    trim: true
  }
}, { _id: true });

// Contact Information Schema
const contactInfoSchema = new mongoose.Schema({
  homePhone: {
    type: String,
    trim: true,
    match: [/^0\d{2,3}-?\d{7,8}$/, 'Invalid home phone format']
  },
  mobilePhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^09\d{9}$/, 'Invalid mobile phone format']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  address: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Postal code must be 10 digits']
  }
}, { _id: false });

// Main User Schema
const userSchema = new mongoose.Schema({
  // Authentication & Basic Info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Banking Information (Array for multiple bank accounts)
  bankingInfo: {
    type: [bankingInfoSchema],
    default: []
  },
  
  // National Credentials
  nationalCredentials: {
    type: nationalCredentialsSchema,
    default: {}
  },
  
  // Contact Information
  contactInfo: {
    type: contactInfoSchema,
  },
  
  // System Data & Verification
  verifications: {
    email: {
      isVerified: {
        type: Boolean,
        default: false
      },
      verifiedAt: {
        type: Date
      },
      verificationToken: {
        type: String
      }
    },
    phone: {
      isVerified: {
        type: Boolean,
        default: false
      },
      verifiedAt: {
        type: Date
      },
      verificationCode: {
        type: String
      },
      verificationCodeExpires: {
        type: Date
      }
    },
    identity: {
      status: {
        type: String,
        enum: ['not_submitted', 'pending', 'approved', 'rejected'],
        default: 'not_submitted'
      },
      submittedAt: {
        type: Date
      },
      reviewedAt: {
        type: Date
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rejectionReason: {
        type: String
      }
    }
  },
  
  // User Roles & Permissions
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin', 'moderator', 'support'],
    default: ['user']
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending_verification'],
    default: 'pending_verification'
  },
  
  // Profile Information
  profile: {
    avatar: {
      type: String
    },
    bio: {
      type: String,
      maxlength: 500
    },
    preferences: {
      language: {
        type: String,
        enum: ['fa', 'en'],
        default: 'fa'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        }
      }
    }
  },
  

  

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('fullName').get(function() {
  if (this.nationalCredentials?.firstName && this.nationalCredentials?.lastName) {
    return `${this.nationalCredentials.firstName} ${this.nationalCredentials.lastName}`;
  }
  return this.username;
});


export default mongoose.models.User || mongoose.model('User', userSchema);