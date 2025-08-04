import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Check login status on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user"); // Optional: Store user name in localStorage
    if (token) {
      setIsLoggedIn(true);
      setUserName(user ? JSON.parse(user).name : "User");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Pizzalicious</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/build-pizza">Build Pizza</Link>
        <Link to="/my-orders">My Orders</Link>

        {isLoggedIn ? (
          <span onClick={handleLogout} className="logout-btn">
            Logout {userName && `(${userName})`}
          </span>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
