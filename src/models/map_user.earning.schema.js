import mongoose from "mongoose";
import userModel from "./user.schema.js";
import transactionModel from "./transaction.schema.js";
const mapUserEarningSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: userModel.name,
      required: true,
    },
    transaction_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref:transactionModel.name
    },
    profit: { type: Number, required: true },
    level: { type: Number, required: true },
  },

  { timestamps: true }
);
const mapUserEarningModel = mongoose.model(
  "mapUserEarning",
  mapUserEarningSchema
);
export default mapUserEarningModel;
