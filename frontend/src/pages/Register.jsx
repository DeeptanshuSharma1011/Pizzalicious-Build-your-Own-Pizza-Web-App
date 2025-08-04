// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/pizza-hero.jpg";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      alert("✅ Registration successful! Check your email to verify.");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="register-box">
        <h1 className="Heading">Register</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button onClick={handleRegister}>Register</button>
        <p onClick={() => navigate("/login")} className="link-text">
          Already a customer? Login
        </p>
      </div>
    </div>
  );
}
