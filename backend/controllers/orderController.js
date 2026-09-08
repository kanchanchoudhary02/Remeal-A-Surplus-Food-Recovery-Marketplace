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

export { createOrder, getMyOrders };