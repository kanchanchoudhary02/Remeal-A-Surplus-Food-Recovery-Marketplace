// controllers/foodRequestController.js

import FoodRequest from "../models/FoodRequest.js";

// @route   POST /api/food-requests
// @access  Private
const createFoodRequest = async (req, res) => {
  try {
    const {
      foodType,
      requiredQuantity,
      requiredDate,
      requiredTime,
      address,
      latitude,
      longitude,
      budget,
      purpose,
    } = req.body;

    if (!requiredQuantity || Number(requiredQuantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Required quantity must be at least 1",
      });
    }

    if (!requiredDate || !requiredTime || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide required date, time, address, latitude and longitude",
      });
    }

    const foodRequest = await FoodRequest.create({
      requesterId: req.user._id,
      foodType: foodType || "any",
      requiredQuantity: Number(requiredQuantity),
      requiredDate,
      requiredTime,
      location: {
        address,
        coordinates: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
      },
      budget: Number(budget) || 0,
      purpose: purpose || "",
    });

    res.status(201).json({
      success: true,
      message: "Food request created successfully",
      foodRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/food-requests
// @access  Public
const getFoodRequests = async (req, res) => {
  try {
    const foodRequests = await FoodRequest.find({ status: "OPEN" })
      .populate("requesterId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodRequests.length,
      foodRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/food-requests/my-requests
// @access  Private
const getMyFoodRequests = async (req, res) => {
  try {
    const foodRequests = await FoodRequest.find({ requesterId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodRequests.length,
      foodRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/food-requests/:id/fulfill
// @access  Private
const fulfillFoodRequest = async (req, res) => {
  try {
    const foodRequest = await FoodRequest.findById(req.params.id);

    if (!foodRequest) {
      return res.status(404).json({ success: false, message: "Food request not found" });
    }

    if (foodRequest.requesterId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot fulfill your own food request",
      });
    }

    if (foodRequest.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer open",
      });
    }

    foodRequest.status = "FULFILLED";
    foodRequest.fulfilledBy = req.user._id;
    await foodRequest.save();

    res.status(200).json({
      success: true,
      message: "Food request fulfilled successfully",
      foodRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createFoodRequest, getFoodRequests, getMyFoodRequests, fulfillFoodRequest };