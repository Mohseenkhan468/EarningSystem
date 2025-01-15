import mongoose from "mongoose";
import userModel from "./user.schema.js";
const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: userModel.name,
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);
const transactionModel = mongoose.model("transaction", transactionSchema);
export default transactionModel;
