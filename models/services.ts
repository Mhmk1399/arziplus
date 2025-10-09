// models/Service.js
import mongoose from "mongoose";
const FieldDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "account_number"
  label: { type: String }, // e.g., "Account Number"
  type: { type: String, default: "string" }, // Can be string, number, etc.
  required: { type: Boolean, default: false },
  items: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  showIf: {
    field: { type: String }, // e.g. "hasAccount"
    value: { type: mongoose.Schema.Types.Mixed }, // e.g. true
  },
});

const DynamicServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  fee: { type: Number, required: true },
  wallet: { type: Boolean, required: true },
  description: { type: String },
  status: { type: String, default: "active" },
  image: { type: String },
  fields: [FieldDefinitionSchema],
});

export default mongoose.models.dynamicServices ||
  mongoose.model("dynamicServices", DynamicServiceSchema);
