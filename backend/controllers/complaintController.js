// controllers/complaintController.js

import Complaint from "../models/Complaint.js";
import Order from "../models/Order.js";

// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { orderId, reason, description } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security: sirf order se juda buyer, provider, ya delivery partner hi complaint file kar sakta hai
    const isBuyer = order.buyerId.toString() === req.user._id.toString();
    const isProvider = order.items.some(
      (item) => item.providerId.toString() === req.user._id.toString()
    );
    const isDelivery =
      order.deliveryPartnerId && order.deliveryPartnerId.toString() === req.user._id.toString();

    if (!isBuyer && !isProvider && !isDelivery) {
      return res.status(403).json({
        success: false,
        message: "You are not associated with this order",
      });
    }

    const complaint = await Complaint.create({
      orderId,
      filedBy: req.user._id,
      reason,
      description,
    });

    res.status(201).json({ success: true, message: "Complaint filed successfully", complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/complaints
// @access  Private (admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("filedBy", "name email role")
      .populate("orderId", "totalAmount status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/complaints/:id/resolve
// @access  Private (admin)
const resolveComplaint = async (req, res) => {
  try {
    const { status, adminNote } = req.body; // "RESOLVED" ya "DISMISSED"

    if (!["RESOLVED", "DISMISSED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    complaint.status = status;
    complaint.adminNote = adminNote || "";
    await complaint.save();

    res.status(200).json({ success: true, message: "Complaint updated", complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createComplaint, getAllComplaints, resolveComplaint };