import React, { useState, useEffect } from "react";
import axios from "axios";
import heroBg from "../assets/pizza-hero.jpg"; // ✅ Import image
import "./BuildPizza.css";

const inventory = {
  base: [
    { name: "Thin Crust", price: 150 },
    { name: "Cheese Burst", price: 150 },
    { name: "Pan Crust", price: 100 },
  ],
  sauce: [
    { name: "Tomato Basil", price: 30 },
    { name: "Pesto Sauce", price: 30 },
    { name: "Alfredo White Sauce", price: 30 },
  ],
  cheese: [
    { name: "Mozzarella", price: 50 },
    { name: "Cheddar", price: 50 },
    { name: "Parmesan", price: 50 },
  ],
  veggie: [
    { name: "Mushrooms", price: 60 },
    { name: "Onions", price: 20 },
    { name: "Capsicum", price: 20 },
  ],
};

export default function BuildPizza() {
  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggie: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in to build your pizza!");
      window.location.href = "/login";
    }
  }, [token]);

  const handleSelect = (category, item) => {
    if (category === "veggie") {
      setSelection((prev) => {
        const veggies = prev.veggie.includes(item.name)
          ? prev.veggie.filter((v) => v !== item.name)
          : [...prev.veggie, item.name];
        return { ...prev, veggie: veggies };
      });
    } else {
      setSelection((prev) => ({ ...prev, [category]: item.name }));
    }
  };

  useEffect(() => {
    let total = 0;
    if (selection.base)
      total += inventory.base.find((b) => b.name === selection.base)?.price || 0;
    if (selection.sauce)
      total += inventory.sauce.find((s) => s.name === selection.sauce)?.price || 0;
    if (selection.cheese)
      total += inventory.cheese.find((c) => c.name === selection.cheese)?.price || 0;
    selection.veggie.forEach((v) => {
      total += inventory.veggie.find((veg) => veg.name === v)?.price || 0;
    });
    setTotalPrice(total);
  }, [selection]);

  const placeOrder = async () => {
    if (!selection.base || !selection.sauce || !selection.cheese || selection.veggie.length === 0) {
      return alert("Please complete your pizza selection!");
    }

    const items = [];
    const addItem = (category, name) => {
      const item = inventory[category].find((i) => i.name === name);
      if (item) items.push({ category, name: item.name, price: item.price });
    };

    addItem("base", selection.base);
    addItem("sauce", selection.sauce);
    addItem("cheese", selection.cheese);
    selection.veggie.forEach((v) => addItem("veggie", v));

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        { items, totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Order placed successfully!");
      setSelection({ base: null, sauce: null, cheese: null, veggie: [] });
      setTotalPrice(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div
      className="build-container"
      style={{ backgroundImage: `url(${heroBg})` }} // ✅ Use imported image
    >
      <div className="hero-overlay"></div>

      <div className="build-content">
        <h1>Build Your Pizza</h1>
        <h2>Total: ₹{totalPrice}</h2>

        {Object.keys(inventory).map((category) => (
          <div key={category} className="category-section">
            <h3>{category.toUpperCase()}</h3>
            {inventory[category].map((item) => (
              <label key={item.name} className="item-label">
                <input
                  type={category === "veggie" ? "checkbox" : "radio"}
                  name={category}
                  onChange={() => handleSelect(category, item)}
                />
                {item.name} (₹{item.price})
              </label>
            ))}
          </div>
        ))}

        <button className="order-btn" onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
