// controllers/paymentController.js

import axios from "axios";

const cashfreeHeaders = {
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  "x-api-version": "2023-08-01",
  "Content-Type": "application/json",
};

// @route   POST /api/payment/create-order
// @access  Private
const createCashfreeOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const orderId = `remeal_order_${Date.now()}_${req.user._id.toString().slice(-6)}`;

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: req.user.name,
        customer_email: req.user.email,
        customer_phone: req.user.phone || "9999999999",
      },
    };

    // ✅ DEBUG — temporary, dekhenge fir hata denge
 console.log("App ID (raw):", JSON.stringify(process.env.CASHFREE_APP_ID));
console.log("Secret Key (raw):", JSON.stringify(process.env.CASHFREE_SECRET_KEY));
    const response = await axios.post(
      `${process.env.CASHFREE_API_URL}/orders`,
      payload,
      { headers: cashfreeHeaders }
    );

    res.status(200).json({
      success: true,
      paymentSessionId: response.data.payment_session_id,
      cashfreeOrderId: response.data.order_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

// @route   GET /api/payment/verify/:orderId
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await axios.get(
      `${process.env.CASHFREE_API_URL}/orders/${orderId}`,
      { headers: cashfreeHeaders }
    );

    const orderStatus = response.data.order_status;

    if (orderStatus === "PAID") {
      return res.status(200).json({ success: true, message: "Payment verified", verified: true });
    }

    res.status(200).json({
      success: true,
      message: `Payment not completed (status: ${orderStatus})`,
      verified: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

export { createCashfreeOrder, verifyPayment };