// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/pizza-hero.jpg";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
  const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

  alert("Login successful!");
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user object

  if (res.data.user.role === "admin") {
    window.location.href = "/admin-dashboard"; // Redirect Admin
  } else {
    window.location.href = "/"; // Redirect User
  }
} catch (err) {
  alert("Login failed: " + (err.response?.data?.message || "Server error"));
}

  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="login-box">
        <h1 className="Heading">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => navigate("/register")} className="link-text">
          Don’t have an account? Register
        </p>
        <p onClick={() => navigate("/forgot-password")} className="link-text"
        style={{ cursor: "pointer", marginTop: "10px" }}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
