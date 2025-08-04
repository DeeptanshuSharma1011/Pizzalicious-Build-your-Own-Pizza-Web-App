// import React from "react";

export default function FakeRazorpayModal({ amount, onSuccess, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          width: "300px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ color: "#F37254" }}>Pizzalicious</h2>
        <p style={{ margin: "15px 0" }}>
          Simulated Razorpay Payment<br />
          <strong>Amount: ₹{amount}</strong>
        </p>
        <button
          onClick={onSuccess}
          style={{
            backgroundColor: "#F37254",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Pay Now
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#aaa",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
