// controllers/orderController.js

import Order from "../models/Order.js";
import FoodListing from "../models/FoodListing.js";
import createNotification from "../utils/createNotification.js";

// @route   POST /api/orders
// @access  Private (buyer)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let subtotal = 0;
    const orderItems = [];

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

    const deliveryFee = 30;
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

    // ✅ Provider ko notify karo naye order ka
    await createNotification(
      orderItems[0].providerId,
      `New order received for ${orderItems[0].title}`,
      "NEW_ORDER",
      order._id
    );

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

    const isProvidersOrder = order.items.some(
      (item) => item.providerId.toString() === req.user._id.toString()
    );
    if (!isProvidersOrder) {
      return res.status(403).json({ success: false, message: "This is not your order" });
    }

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

    // ✅ Buyer ko notify karo
    if (status === "CONFIRMED") {
      await createNotification(
        order.buyerId,
        `Your order has been confirmed by the provider`,
        "ORDER_CONFIRMED",
        order._id
      );
    } else if (status === "REJECTED") {
      await createNotification(
        order.buyerId,
        `Your order was rejected by the provider`,
        "ORDER_REJECTED",
        order._id
      );
    } else if (status === "READY_FOR_PICKUP") {
      await createNotification(
        order.buyerId,
        `Your food is ready for pickup`,
        "FOOD_READY",
        order._id
      );
    }

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
      deliveryPartnerId: null,
    })
      .populate("buyerId", "name phone address")
      .populate("items.providerId", "name address")
      .sort({ createdAt: 1 });

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

    // ✅ Buyer ko notify karo
    await createNotification(
      order.buyerId,
      `A delivery partner has been assigned to your order`,
      "DELIVERY_ACCEPTED",
      order._id
    );

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

    if (!order.deliveryPartnerId || order.deliveryPartnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This delivery is not assigned to you",
      });
    }

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

    if (status === "DELIVERED" && order.paymentStatus === "PENDING") {
      order.paymentStatus = "PAID";
    }

    await order.save();

    // ✅ Buyer ko notify karo
    const statusMessages = {
      PICKED_UP: "Your order has been picked up by the delivery partner",
      ON_THE_WAY: "Your order is on the way",
      DELIVERED: "Your order has been delivered. Enjoy your meal!",
    };

    if (statusMessages[status]) {
      await createNotification(order.buyerId, statusMessages[status], status, order._id);
    }

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