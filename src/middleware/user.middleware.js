import mongoose from "mongoose";
import userModel from "../models/user.schema.js";
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "thisissecretkey";
const userMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed.",
      });
    }
    const data = await jwt.verify(token, JWT_SECRET_KEY);
    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(data._id),
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed.",
      });
    }
    req.user_id = user._id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};
export default userMiddleware;
