import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    await newUser.save();

    // Send verification email
    const verifyUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    await sendEmail(email, "Verify your email", `Click here to verify: ${verifyUrl}`);

    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send(`
        <html>
        <head>
          <style>
            body { background-color: #111; color: white; text-align: center; font-family: 'Segoe UI', sans-serif; padding-top: 100px; }
            h1 { color: crimson; }
            p { margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>❌ Invalid or Expired Link</h1>
          <p>Please try registering again.</p>
        </body>
        </html>
      `);
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // ✅ Styled HTML success page
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verified</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', sans-serif;
        background: url('http://localhost:3000/pizza-hero.jpg') center/cover no-repeat fixed;
        position: relative;
      }
      /* Dark overlay to make text readable */
      body::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 0;
      }
      .card {
        position: relative;
        z-index: 1;
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
    res.status(500).send(`
      <html>
        <body style="background-color:black;color:white;text-align:center;padding-top:100px;">
          <h1>⚠️ Server Error</h1>
          <p>Please try again later.</p>
        </body>
      </html>
    `);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset Request", `Click to reset your password: ${resetUrl}`);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
