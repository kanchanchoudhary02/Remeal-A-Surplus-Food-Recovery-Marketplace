// controllers/reviewController.js

import Review from "../models/Review.js";
import Order from "../models/Order.js";

// @route   POST /api/reviews
// @access  Private (buyer)
const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security: ye order isi buyer ka hona chahiye
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "This is not your order" });
    }

    // Sirf DELIVERED orders pe review allowed
    if (order.status !== "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "You can only review orders that have been delivered",
      });
    }

    // Duplicate check (application level — index bhi hai as backup)
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this order" });
    }

    const providerId = order.items[0]?.providerId; // MVP: single-provider-per-order assumption (Day 16 se)

    const review = await Review.create({
      orderId,
      buyerId: req.user._id,
      providerId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/reviews/:providerId
// @access  Public
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate("buyerId", "name")
      .sort({ createdAt: -1 });

    // Average rating calculate karo
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createReview, getProviderReviews };