import userModel from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import Joi from "joi";
import mapUserReferralModel from "../models/map_user.referral.schema.js";
import otpModel from "../models/otp.schema.js";
import mapUserEarningModel from "../models/map_user.earning.schema.js";
import transactionModel from "../models/transaction.schema.js";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import notifyUser from "../socket/socket.server.js";
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY||'thisissecretkey';
export default class UserController {
  static async generateReferralCode(referrerEmail) {
    try {
      return await crypto
        .createHash("sha256")
        .update(referrerEmail)
        .digest("hex")
        .substring(0, 8);
    } catch (err) {
      console.log(err);
    }
  }
  static async findOtpData({ user_id, type }) {
    return await otpModel.findOne({
      user_id,
      expire_at: { $gte: new Date().getTime() },
      type,
    });
  }
  static async saveOtp({ user_id, type }) {
    await new otpModel({
      user_id,
      expire_at: new Date().getTime() + 2 * 60000,
      otp: 123456,
      type,
    }).save();
  }
  static async hashPassword(text) {
    return await bcrypt.hash(text, 10);
  }
  static async generateToken(payload) {
    return await jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: "365d",
    });
  }
  static async signUp(req, res) {
    try {
      const { first_name, last_name, email, password, referral_code } =
        req.body;
      console.log("password", password);
      const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        referral_code: Joi.string(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMsg = error.details.map((item) => item.message);
        return res.status(400).json({
          success: false,
          message: errorMsg,
        });
      }
      const user = await userModel.findOne({ email });
      if (user) {
        if (user.is_active) {
          return res.status(400).json({
            success: false,
            message: "This email is already registered.",
          });
        } else {
          const otpData = await UserController.findOtpData({
            user_id: user._id,
            type: "verify_account",
          });
          if (!otpData) {
            await UserController.saveOtp({
              user_id: user._id,
              type: "verify_account",
            });
          }
          return res.status(201).json({
            success: true,
            message: "Verify account",
          });
        }
      }
      let referrerUser = null;
      let level = 0;
      if (referral_code) {
        referrerUser = await userModel.findOne({
          referral_code,
        });
        if (!referrerUser) {
          return res.status(400).json({
            success: false,
            message: "Invalid Referral code.",
          });
        }
        switch (referrerUser.level) {
          case 0:
            level = 1;
            break;
          case 1:
            level = 2;
            break;
        }

        const referralCount = await mapUserReferralModel.countDocuments({
          parent_id: referrerUser._id,
        });
        if (referralCount >= 8) {
          return res.status(400).json({
            success: false,
            message: "Referrar has reached maximum limit.",
          });
        }
      }
      const hashedPassword = await UserController.hashPassword(password);
      const referral = await UserController.generateReferralCode(email);
      const newUser = await new userModel({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        referral_code: referral,
        level,
      }).save();
      if (referrerUser) {
        if (referral_code) {
          await new mapUserReferralModel({
            parent_id: referrerUser._id,
            child_id: newUser._id,
          }).save();
        }
      }
      await UserController.saveOtp({
        user_id: newUser._id,
        type: "verify_account",
      });
      return res.status(201).json({
        success: true,
        message: "User created successfully.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async verifyAccount(req, res) {
    try {
      const { email, otp } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMsg = error.details.map((item) => item.message);
        return res.status(201).json({
          success: false,
          message: errorMsg,
        });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "This email is not registerd.",
        });
      }
      const otpData = await UserController.findOtpData({
        user_id: user._id,
        type: "verify_account",
      });
      if (!otpData) {
        return res.status(400).json({
          success: false,
          message: "Otp not found.",
        });
      }
      if (otpData.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid otp provided.",
        });
      }
      const updateUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { is_active: true } },
        { new: true }
      );
      await otpModel.deleteOne({ _id: otpData._id });
      const payload = { _id: user._id, role: "user" };
      const token = await UserController.generateToken(payload);
      const userObj = updateUser.toJSON();
      delete userObj.password;
      return res.status(201).json({
        success: true,
        message: "Account verified successfully.",
        token,
        data: userObj,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMsg = await error.details.map((item) => item.message);
        return res.status(400).json({
          success: false,
          message: errorMsg,
        });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "This email is not registered.",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      if (!user.is_active) {
        const otpData = await UserController.findOtpData({
          user_id: user._id,
          type: "verify_account",
        });
        if (!otpData) {
          await UserController.saveOtp({
            user_id: user._id,
            type: "verify_account",
          });
        }
        return res.status(201).json({
          success: true,
          message: "Verify account",
        });
      }
      const payload = { _id: user._id, role: "user" };
      const token = await UserController.generateToken(payload);
      const userObj = user.toJSON();
      delete userObj.password;
      return res.status(201).json({
        success: true,
        message: "Login successfully.",
        token,
        data: userObj,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async resendOtp(req, res) {
    try {
      const { email } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMsg = await error.details.map((item) => item.message);
        return res.status(400).json({
          success: false,
          message: errorMsg,
        });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "This email is not registered.",
        });
      }
      const otpData = await UserController.findOtpData({
        user_id: user._id,
        type: "verify_account",
      });
      if (otpData) {
        return res.status(400).json({
          success: false,
          message: "Otp already sent, please wait",
        });
      }
      await UserController.saveOtp({
        user_id: user._id,
        type: "verify_account",
      });
      return res.status(201).json({
        success: true,
        message: "Otp sent successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async saveEarning({ user_id, transaction_id, profit, level }) {
    await new mapUserEarningModel({
      user_id,
      transaction_id,
      profit,
      level,
    }).save();
  }
  static async purchase(req, res) {
    try {
      const { amount } = req.body;
      const user_id = req.user_id;
      const schema = Joi.object({
        amount: Joi.number().min(1).required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMsg = await error.details.map((item) => item.message);
        return res.status(400).json({
          success: false,
          message: errorMsg,
        });
      }
      const newTransaction = await new transactionModel({
        user_id: user_id,
        amount,
      }).save();
      if (amount > 1000) {
        const data = await userModel.aggregate([
          {
            $match: { _id: user_id },
          },
          {
            $lookup: {
              from: "mapuserreferrals",
              localField: "_id",
              foreignField: "child_id",
              as: "referrer",
            },
          },
          {
            $unwind: { path: "$referrer", preserveNullAndEmptyArrays: true },
          },
        ]);
        const parentId = data.length > 0 ? data[0]?.referrer?.parent_id : null;
        if (parentId) {
          const parentLevelProfit = (amount * 5) / 100;
          await UserController.saveEarning({
            user_id: parentId,
            transaction_id: newTransaction._id,
            profit: parentLevelProfit,
            level: 1,
          });
          notifyUser(parentId, {
            type: "direct_earning",
            amount: parentLevelProfit,
            from: user_id,
            level: 1,
          });
          await userModel.updateOne(
            { _id: parentId },
            { $inc: { total_earnings: parentLevelProfit } }
          );
          const parentReferrer = await mapUserReferralModel.findOne({
            child_id: parentId,
          });
          // console.log(parentReferrer);
          const grandParentId = parentReferrer?.parent_id;
          if (grandParentId) {
            const grandParentLevelProfit = (amount * 1) / 100;
            await UserController.saveEarning({
              user_id: grandParentId,
              transaction_id: newTransaction._id,
              profit: grandParentLevelProfit,
              level: 2,
            });
            notifyUser(parentId, {
              type: "indirect_earning",
              amount: grandParentLevelProfit,
              from: user_id,
              level: 2,
            });
            await userModel.updateOne(
              { _id: grandParentId },
              { $inc: { total_earnings: grandParentLevelProfit } }
            );
          }
        }
      }
      return res.status(201).json({
        success: true,
        message: "Transaction successfull.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async getTransactions(req, res) {
    try {
      const user_id = req.user_id;
      console.log(user_id);
      const { page = 1, limit = 10 } = req.query;
      const data = await transactionModel
        .find({ user_id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      const dataCount = await transactionModel.countDocuments({ user_id });
      return res.status(200).json({
        success: true,
        pages: Math.ceil(dataCount / limit) || 1,
        page: +page,
        limit: +limit,
        total: dataCount,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async getEarnings(req, res) {
    try {
      const user_id = req.user_id;
      console.log(user_id);
      const { page = 1, limit = 10 } = req.query;
      const data = await mapUserEarningModel.aggregate([
        {
          $match: { user_id },
        },
        {
          $lookup: {
            from: "transactions",
            as: "transaction",
            localField: "transaction_id",
            foreignField: "_id",
          },
        },
        {
          $unwind: { path: "$transaction" },
        },
        {
          $facet: {
            paginatedResults: [
              {
                $sort: { createdAt: -1 },
              },
              { $skip: (page - 1) * limit },
              { $limit: +limit },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
        {
          $addFields: {
            total: {
              $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
            },
          },
        },
        {
          $project: {
            paginatedResults: 1,
            total: 1,
          },
        },
      ]);
      return res.status(200).json({
        success: true,
        data: data[0].paginatedResults,
        pages: Math.ceil(data[0].total / limit) || 1,
        page: +page,
        limit: +limit,
        total: data[0].total,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async getProfile(req, res) {
    try {
      const user_id = req.user_id;
      const data = await this.userModel.findById(user_id);
      const dataObj = data.toJSON();
      delete dataObj.password;
      return res.status(200).json({
        success: true,
        data: dataObj,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
