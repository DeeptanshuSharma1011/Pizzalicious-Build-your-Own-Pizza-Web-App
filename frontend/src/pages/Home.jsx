import React from "react";
import { useNavigate } from "react-router-dom";
import pizzaHero from "../assets/pizza-hero.jpg";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${pizzaHero})`,
      }}
    >
      <div className="hero-content">
        <h1>Build Your Perfect Pizza</h1>
        <p>Fresh ingredients, endless choices, and your dream pizza crafted to perfection.</p>
        <button className="hero-btn" onClick={() => navigate("/build-pizza")}>
          Build Your Pizza
        </button>
      </div>
    </div>
  );
}
