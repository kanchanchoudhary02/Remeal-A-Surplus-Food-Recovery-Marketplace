// controllers/orderController.js

import Order from "../models/Order.js";
import FoodListing from "../models/FoodListing.js";

// @route   POST /api/orders
// @access  Private (buyer)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    // items = [{ foodListingId, quantity }, ...]  — frontend se aayega

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let subtotal = 0;
    const orderItems = [];

    // Har item ke liye actual listing MongoDB se dobara verify karo
    // (frontend ki price pe bharosa mat karo — koi tamper kar sakta hai)
    for (const item of items) {
      const listing = await FoodListing.findById(item.foodListingId);

      if (!listing || listing.status !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: `"${listing?.title || "Item"}" is no longer available`,
        });
      }

      const itemTotal = listing.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        foodListingId: listing._id,
        providerId: listing.providerId,
        title: listing.title,
        quantity: item.quantity,
        price: listing.price,
      });
    }

    const deliveryFee = 30; // abhi ke liye fixed — Day 19 ke baad distance-based bana sakte hain
    const platformFee = 10;
    const totalAmount = subtotal + deliveryFee + platformFee;

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      platformFee,
      totalAmount,
      paymentStatus: subtotal === 0 ? "FREE" : "PENDING",
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/orders/my-orders
// @access  Private (buyer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/orders/provider-orders
// @access  Private (provider)
const getProviderOrders = async (req, res) => {
  try {
    // Sirf wo orders lao jinke items me is provider ka providerId ho
    const orders = await Order.find({ "items.providerId": req.user._id })
      .populate("buyerId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/orders/:id/status
// @access  Private (provider)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Provider sirf ye 3 transitions kar sakta hai — koi bhi random status set nahi kar sakta
    const allowedStatuses = ["CONFIRMED", "READY_FOR_PICKUP", "REJECTED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Provider can only set: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security check — ye order isi provider ka hai ya nahi
    const isProvidersOrder = order.items.some(
      (item) => item.providerId.toString() === req.user._id.toString()
    );
    if (!isProvidersOrder) {
      return res.status(403).json({ success: false, message: "This is not your order" });
    }

    // Simple state-machine check — status sirf logical order me hi badal sakta hai
    const validTransitions = {
      PLACED: ["CONFIRMED", "REJECTED"],
      CONFIRMED: ["READY_FOR_PICKUP"],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/orders/available-deliveries
// @access  Private (delivery)
const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "READY_FOR_PICKUP",
      deliveryPartnerId: null, // jo abhi tak kisi ne accept nahi ki
    })
      .populate("buyerId", "name phone address")
      .populate("items.providerId", "name address")
      .sort({ createdAt: 1 }); // sabse purana pehle — jo zyada der se wait kar raha hai

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/orders/:id/accept-delivery
// @access  Private (delivery)
const acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "READY_FOR_PICKUP") {
      return res.status(400).json({
        success: false,
        message: "This order is not ready for pickup yet",
      });
    }

    if (order.deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "This delivery has already been accepted by someone else",
      });
    }

    order.deliveryPartnerId = req.user._id;
    await order.save();

    res.status(200).json({ success: true, message: "Delivery accepted", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/orders/my-deliveries
// @access  Private (delivery)
const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartnerId: req.user._id })
      .populate("buyerId", "name phone address")
      .populate("items.providerId", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   PUT /api/orders/:id/delivery-status
// @access  Private (delivery)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["PICKED_UP", "ON_THE_WAY", "DELIVERED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security check — sirf assigned delivery partner hi status badal sakta hai
    if (!order.deliveryPartnerId || order.deliveryPartnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This delivery is not assigned to you",
      });
    }

    // State machine — sirf logical order me hi aage badh sakta hai
    const validTransitions = {
      READY_FOR_PICKUP: ["PICKED_UP"],
      PICKED_UP: ["ON_THE_WAY"],
      ON_THE_WAY: ["DELIVERED"],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    // Agar delivered ho gaya, payment bhi settle maano (free food ke alawa)
    if (status === "DELIVERED" && order.paymentStatus === "PENDING") {
      order.paymentStatus = "PAID";
    }

    await order.save();

    res.status(200).json({ success: true, message: "Delivery status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createOrder,
  getMyOrders,
  getProviderOrders,
  updateOrderStatus,
  getAvailableDeliveries,
  acceptDelivery,
  getMyDeliveries,
  updateDeliveryStatus,
};
