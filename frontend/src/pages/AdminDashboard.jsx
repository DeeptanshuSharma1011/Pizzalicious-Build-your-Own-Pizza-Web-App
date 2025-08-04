// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import heroBg from "../assets/pizza-hero.jpg";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
    fetchInventory();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/orders/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  const fetchInventory = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory/admin/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInventory(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/orders/admin/update-status/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  return (
    <div className="admin-container" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="admin-content">
        <h1 className="Heading">Admin Dashboard</h1>

        <h2>All Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.email || "Guest"}</td>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name}</div>
                  ))}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
