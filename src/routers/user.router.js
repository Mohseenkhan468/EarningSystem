import express from "express";
import UserController from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
const router = express.Router();
/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign up a new user or verify an existing account.
 *     description: Allows a user to sign up or verify their account if the email is already registered.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The user's last name (optional).
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password, must be at least 8 characters long.
 *                 example: securepassword123
 *               referral_code:
 *                 type: string
 *                 description: The referral code of an existing user (optional).
 *                 example: ABC123XYZ
 *     responses:
 *       201:
 *         description: User created or verification request sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *                 action:
 *                   type: string
 *                   example: "verify_account"
 *       400:
 *         description: Bad Request, validation error or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This email is already registered."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred during signup."
 */

router.post("/signUp", UserController.signUp);
/**
 * @swagger
 * /users/verify_account:
 *   post:
 *     summary: Verify a user's account using OTP.
 *     description: Allows a user to verify their account by providing the correct OTP sent to their email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               otp:
 *                 type: number
 *                 description: The OTP code sent to the user's email.
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Account successfully verified and user logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully."
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   type: object
 *                   description: User details without the password field.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7d7b1f"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     referral_code:
 *                       type: string
 *                       example: "ABC123XYZ"
 *       400:
 *         description: Bad request, OTP mismatch, or OTP not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP provided."
 *       401:
 *         description: Unauthorized, email not registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This email is not registered."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred during account verification."
 */

router.post("/verify_account", UserController.verifyAccount);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user.
 *     description: Allows a user to log in by providing their email and password. If the account is not active, an OTP will be sent for verification.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password, must be at least 8 characters long.
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User logged in successfully or OTP verification required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successfully."
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   type: object
 *                   description: User details without the password field.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001f7d7b1f"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Bad request, validation error or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       401:
 *         description: Unauthorized, email not registered or account not verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This email is not registered."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred during login."
 */

router.post("/login", UserController.login);
/**
 * @swagger
 * /users/send_otp:
 *   post:
 *     summary: Resend OTP for account verification.
 *     description: Resends the OTP to the user's email for account verification if it was not already sent recently.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *     responses:
 *       201:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Otp sent successfully."
 *       400:
 *         description: Bad request or OTP already sent recently.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Otp already sent, please wait."
 *       401:
 *         description: Unauthorized, email not registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This email is not registered."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while resending OTP."
 */

router.post("/send_otp", UserController.resendOtp);
/**
 * @swagger
 * /users/purchase:
 *   post:
 *     summary: Process a purchase transaction and apply referral earnings.
 *     description: Processes a purchase transaction, applies referral earnings if the amount is greater than 1000, and notifies the referrers. Requires Bearer token authentication.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The purchase amount to be processed.
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Transaction processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction successful."
 *       400:
 *         description: Bad request, invalid amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid amount."
 *       401:
 *         description: Unauthorized, invalid or missing Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access, invalid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred during the transaction."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post("/purchase", userMiddleware, UserController.purchase);
/**
 * @swagger
 * /users/transactions:
 *   get:
 *     summary: Get a list of transactions for a user.
 *     description: Fetches the list of transactions for the authenticated user, supporting pagination.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of transactions per page (default is 10).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages available for pagination.
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: Number of transactions per page.
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   description: Total number of transactions.
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized, invalid or missing Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access, invalid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching transactions."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/transactions", userMiddleware, UserController.getTransactions);
/**
 * @swagger
 * /users/earnings:
 *   get:
 *     summary: Get a list of earnings for a user.
 *     description: Fetches the list of earnings for the authenticated user, supporting pagination.
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of earnings per page (default is 10).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of earnings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages available for pagination.
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: Number of earnings per page.
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   description: Total number of earnings.
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the earning record.
 *                       transaction_id:
 *                         type: string
 *                         description: The ID of the associated transaction.
 *                       amount:
 *                         type: number
 *                         description: The earning amount.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the earning was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the earning was last updated.
 *       401:
 *         description: Unauthorized, invalid or missing Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access, invalid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching earnings."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/earnings", userMiddleware, UserController.getEarnings);
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the authenticated user's profile.
 *     description: Fetches the profile details of the authenticated user, excluding sensitive information like the password.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The profile data of the authenticated user.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     name:
 *                       type: string
 *                       description: The name of the user.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user's account was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user's profile was last updated.
 *       401:
 *         description: Unauthorized, invalid or missing Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access, invalid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the profile."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/profile", userMiddleware, UserController.getProfile);

export default router;
