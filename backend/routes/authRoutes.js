import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post("/register", registerUser);

/**
 * @route   GET /api/auth/verify/:token
 * @desc    Verify user email with styled HTML response
 */
router.get("/verify/:token", async (req, res, next) => {
  try {
    // Call the controller to verify user
    const result = await verifyEmail(req, res, true); 
    // Pass "true" to indicate we want raw user object from controller

    if (!result || !result.success) {
      return res.status(400).send(`
        <html>
        <head>
          <style>
            body {
              background-color: #111;
              color: white;
              font-family: 'Segoe UI', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: rgba(255, 255, 255, 0.08);
              padding: 40px;
              border-radius: 12px;
              text-align: center;
              backdrop-filter: blur(10px);
            }
            h1 { color: crimson; }
            p { margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>❌ Invalid or Expired Link</h1>
            <p>Please try registering again.</p>
          </div>
        </body>
        </html>
      `);
    }

    // ✅ Success page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verified</title>
        <style>
          body {
            background: url('https://source.unsplash.com/1600x900/?pizza') center/cover no-repeat;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', sans-serif;
          }
          .card {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(10px);
            color: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
          }
          .card h1 {
            color: goldenrod;
            margin-bottom: 15px;
          }
          .card p {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .card a {
            display: inline-block;
            padding: 12px 25px;
            background-color: #ff4c4c;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: 0.3s;
          }
          .card a:hover {
            background-color: #e63e3e;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✅ Email Verified!</h1>
          <p>Your email has been successfully verified. You can now log in to your account.</p>
          <a href="http://localhost:3000/login">Go to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password
 */
router.post("/reset-password/:token", resetPassword);

export default router;
