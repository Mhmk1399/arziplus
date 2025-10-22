import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  salePrise: {
    type: Number,
    required: true,
  },
  buyPrice: { type: Number, required: true },
});

const Currency = mongoose.models.Currency || mongoose.model("Currency", currencySchema);

export default Currency;
