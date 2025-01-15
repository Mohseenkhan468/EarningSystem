import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    referral_code: { type: String, trim: true, default: "" },
    level: { type: Number, enum: [0, 1, 2] },
    password: { type: String, required: true, trim: true },
    is_active: { type: Boolean, default: false },
    total_earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user", UserSchema);
export default userModel;
