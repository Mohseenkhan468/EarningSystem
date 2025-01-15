import express from "express";
import UserController from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
const router = express.Router()
router.post("/signUp", UserController.signUp);
router.post("/verify_account", UserController.verifyAccount);
router.post("/login", UserController.login);
router.post("/send_otp", UserController.resendOtp);
router.post("/purchase", userMiddleware,UserController.purchase);
router.get("/transactions",userMiddleware,UserController.getTransactions)
router.get("/earnings",userMiddleware,UserController.getEarnings)
router.get("/profile",userMiddleware,UserController.getProfile)

export default router;
