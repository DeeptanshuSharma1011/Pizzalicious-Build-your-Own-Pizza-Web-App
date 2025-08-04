// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import heroBg from "../assets/pizza-hero.jpg";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in to view orders!");
      window.location.href = "/login";
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  return (
    <div className="orders-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="orders-content">
        <h1 className="Heading">My Orders</h1>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i}>{item.name}</div>
                    ))}
                  </td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
