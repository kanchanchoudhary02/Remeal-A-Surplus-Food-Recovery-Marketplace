// controllers/adminController.js

import User from "../models/User.js";
import FoodListing from "../models/FoodListing.js";
import Order from "../models/Order.js";

// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalDelivery = await User.countDocuments({ role: "delivery" });
    const activeListings = await FoodListing.countDocuments({ status: "ACTIVE" });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "DELIVERED" });

    // "Meals rescued" — sirf delivered orders ke items ki total quantity
    const deliveredOrders = await Order.find({ status: "DELIVERED" });
    const mealsRescued = deliveredOrders.reduce((sum, order) => {
      const orderQty = order.items.reduce((s, item) => s + item.quantity, 0);
      return sum + orderQty;
    }, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalBuyers,
        totalDelivery,
        activeListings,
        totalOrders,
        completedOrders,
        mealsRescued,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/providers
// @access  Private (admin)
const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/providers/:id/verify
// @access  Private (admin)
const verifyProvider = async (req, res) => {
  try {
    const { status } = req.body; // "VERIFIED" ya "REJECTED"

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const provider = await User.findById(req.params.id);

    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    provider.verificationStatus = status;
    await provider.save();

    res.status(200).json({ success: true, message: `Provider ${status.toLowerCase()}`, provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/block
// @access  Private (admin)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Admin khud ko block na kar sake
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot block yourself" });
    }

    user.isBlocked = !user.isBlocked; // toggle
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/orders
// @access  Private (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/listings
// @access  Private (admin)
const getAllListings = async (req, res) => {
  try {
    const listings = await FoodListing.find()
      .populate("providerId", "name providerType")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/listings/:id
// @access  Private (admin)
const removeListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    listing.status = "CANCELLED"; // hard-delete nahi, soft-remove — history preserve rehti hai
    await listing.save();

    res.status(200).json({ success: true, message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getDashboardStats,
  getAllUsers,
  getAllProviders,
  verifyProvider,
  toggleBlockUser,
  getAllOrders,
  getAllListings,
  removeListing,
};