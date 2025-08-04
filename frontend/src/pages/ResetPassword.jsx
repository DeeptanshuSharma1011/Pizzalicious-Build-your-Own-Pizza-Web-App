// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import heroBg from "../assets/pizza-hero.jpg";
import "./ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password) return alert("Please enter a new password.");
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      alert("✅ Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Failed to reset password"));
    }
  };

  return (
    <div className="reset-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="reset-box">
        <h1>Reset Your Password</h1>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}
