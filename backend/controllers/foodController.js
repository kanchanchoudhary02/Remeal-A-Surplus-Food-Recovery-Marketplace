// controllers/foodController.js

import FoodListing from "../models/FoodListing.js";

// @route   POST /api/foods
// @access  Private (provider only)
const createFoodListing = async (req, res) => {
  try {
    const {
      title,
      description,
      foodType,
      listingType,
      quantity,
      servings,
      originalPrice,
      price,
      availableFrom,
      availableUntil,
      consumeBefore,
      preparationTime,
      storageType,
      safetyDeclaration,
      pickupAddress,
      longitude,
      latitude,
      images,
    } = req.body;

    const foodListing = await FoodListing.create({
      providerId: req.user._id, // "protect" middleware se aaya hua logged-in user
      title,
      description,
      foodType,
      listingType,
      quantity,
      servings,
      originalPrice,
      price,
      availableFrom,
      availableUntil,
      consumeBefore,
      preparationTime,
      storageType,
      safetyDeclaration,
      pickupLocation: {
        address: pickupAddress,
        coordinates: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      images: images || [],
    });

    res.status(201).json({
      success: true,
      message: "Food listing created successfully",
      foodListing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/foods
// @access  Public

    // Abhi sirf ACTIVE listings dikhao — expired/sold-out/cancelled nahi
    const getFoodListings = async (req, res) => {
  try {
    const { search, foodType, listingType, isFree, maxPrice } = req.query;

    // Base query — hamesha sirf ACTIVE listings
    const query = { status: "ACTIVE" };

    // ✅ Search by title (case-insensitive, partial match)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // ✅ Food type filter (vegetarian / non_vegetarian / vegan)
    if (foodType) {
      query.foodType = foodType;
    }

    // ✅ Listing type filter (SURPLUS / END_OF_DAY_SURPLUS)
    if (listingType) {
      query.listingType = listingType;
    }

    // ✅ Free food only
    if (isFree === "true") {
      query.price = 0;
    }

    // ✅ Max price filter
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    const foodListings = await FoodListing.find(query)
      .populate("providerId", "name providerType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodListings.length,
      foodListings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/foods/:id
// @access  Public
const getFoodListingById = async (req, res) => {
  try {
    const foodListing = await FoodListing.findById(req.params.id).populate(
      "providerId",
      "name providerType phone address"
    );

    if (!foodListing) {
      return res.status(404).json({ success: false, message: "Food listing not found" });
    }

    res.status(200).json({ success: true, foodListing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createFoodListing, getFoodListings, getFoodListingById };