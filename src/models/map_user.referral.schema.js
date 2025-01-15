import mongoose from "mongoose";
import userModel from "./user.schema.js";
const mapUserReferralSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Types.ObjectId,
      ref: userModel.name,
      required: true,
    },
    child_id: {
      type: mongoose.Types.ObjectId,
      ref: userModel.name,
      required: true,
    },
  },
  { timestamps: true }
);
const mapUserReferralModel = mongoose.model(
  "mapUserReferral",
  mapUserReferralSchema
);
export default mapUserReferralModel;
