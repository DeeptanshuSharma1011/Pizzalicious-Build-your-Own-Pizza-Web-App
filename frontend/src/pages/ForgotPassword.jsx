// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import heroBg from "../assets/pizza-hero.jpg";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email address.");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      alert("✅ Password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Failed to send reset link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="forgot-box">
        <h1>Forgot Password</h1>
        <p>Enter your registered email to receive a password reset link.</p>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleForgotPassword} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}
