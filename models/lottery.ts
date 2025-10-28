import mongoose from "mongoose";

const lotterySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // User ID from JWT token
    status: {
      type: String,
      enum: ["pending", "in_review", "approved", "rejected", "completed"],
      default: "pending",
    },
    rejectionReason: { type: String },
    adminNotes: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Payment information
    paymentMethod: {
      type: String,
      enum: ["wallet", "direct", "card"],
      required: true,
    },
    patmentImage: { type: String },
    paymentAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    receiptUrl: { type: String },
    paymentDate: { type: Date, default: Date.now },
    famillyInformations: [
      {
        maridgeState: { type: Boolean },
        numberOfChildren: { type: Number },
        towPeopleRegistration: { type: Boolean },
      },
    ],
    registererInformations: [
      {
        initialInformations: {
          firstName: { type: String },
          lastName: { type: String },
          gender: { type: String },
          birthDate: {
            year: { type: String },
            month: { type: String },
            day: { type: String },
          },
          country: { type: String },
          city: { type: String },
          citizenshipCountry: { type: String },
        },
        residanceInformation: [
          {
            residanceCountry: { type: String },
            residanceCity: { type: String },
            residanseState: { type: String },
            postalCode: { type: String },
            residanseAdress: { type: String },
          },
        ],
        contactInformations: [
          {
            activePhoneNumber: { type: String },
            secondaryPhoneNumber: { type: String },
            email: { type: String },
          },
        ],
        otherInformations: [
          {
            persianName: { type: String },
            persianLastName: { type: String },
            lastDegree: { type: String },
            partnerCitizenShip: { type: String },
            imageUrl: { type: String },
          },
        ],
      },
    ],
    registererPartnerInformations: [
      {
        initialInformations: {
          firstName: { type: String },
          lastName: { type: String },
          gender: { type: String },
          birthDate: {
            year: { type: String },
            month: { type: String },
            day: { type: String },
          },
          country: { type: String },
          city: { type: String },
          citizenshipCountry: { type: String },
        },

        otherInformations: [
          {
            persianName: { type: String },
            persianLastName: { type: String },
            lastDegree: { type: String },
            partnerCitizenShip: { type: String },
            imageUrl: { type: String },
          },
        ],
      },
    ],
    registererChildformations: [
      {
        initialInformations: {
          firstName: { type: String },
          lastName: { type: String },
          gender: { type: String },
          birthDate: {
            year: { type: String },
            month: { type: String },
            day: { type: String },
          },
          country: { type: String },
          city: { type: String },
          citizenshipCountry: { type: String },
        },

        otherInformations: [
          {
            persianName: { type: String },
            persianLastName: { type: String },
            lastDegree: { type: String },
            partnerCitizenShip: { type: String },
            imageUrl: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Lottery ||
  mongoose.model("Lottery", lotterySchema);
