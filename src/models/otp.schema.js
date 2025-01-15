import mongoose from "mongoose";
import userModel from "./user.schema.js";
const otpSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: userModel.name,
      required: true,
    },
    type:{type:String,required:true},
    otp: { type: Number, required: true },
    expire_at: { type: Date, default: null },
  },
  { timestamps: true }
);
const otpModel = mongoose.model("otp", otpSchema);
export default otpModel;
