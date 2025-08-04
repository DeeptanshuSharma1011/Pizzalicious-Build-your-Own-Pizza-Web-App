import express from "express";
const router = express.Router();

// Mock Razorpay order creation
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Simulate Razorpay Order Response
    const mockOrder = {
      id: "order_" + Date.now(),
      amount,
      currency: "INR",
      status: "created",
    };

    res.json({ order: mockOrder });
  } catch (err) {
    res.status(500).json({ message: "Error creating mock order" });
  }
});

// Mock Razorpay payment verification
router.post("/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Always "verify" successfully in mock
    res.json({ success: true, orderId, paymentId });
  } catch (err) {
    res.status(500).json({ message: "Error verifying mock payment" });
  }
});

export default router;
