// controllers/foodController.js

import FoodListing from "../models/FoodListing.js";
import expireOldListings from "../utils/expireListings.js";

// Haversine formula: do lat/lng points ke beech ka distance (km me) nikalta hai
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

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

    // ✅ NAYA — sanity check: availableUntil, availableFrom se pehle na ho
    if (new Date(availableUntil) <= new Date(availableFrom)) {
      return res.status(400).json({
        success: false,
        message: "Available Until must be after Available From",
      });
    }

    const foodListing = await FoodListing.create({
      providerId: req.user._id,
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
const getFoodListings = async (req, res) => {
  try {
    // ✅ NAYA — sabse pehle expired listings clean up kar do
    await expireOldListings();

    const { search, foodType, listingType, isFree, maxPrice, lat, lng, radius, urgentOnly } = req.query;

    const query = { status: "ACTIVE" };
    if (search) query.title = { $regex: search, $options: "i" };
    if (foodType) query.foodType = foodType;
    if (listingType) query.listingType = listingType;
    if (isFree === "true") query.price = 0;
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    let foodListings = await FoodListing.find(query)
      .populate("providerId", "name providerType")
      .sort({ createdAt: -1 })
      .lean();

    if (lat && lng) {
      const buyerLat = Number(lat);
      const buyerLng = Number(lng);

      foodListings = foodListings.map((food) => {
        const [foodLng, foodLat] = food.pickupLocation.coordinates.coordinates;
        const distance = getDistanceInKm(buyerLat, buyerLng, foodLat, foodLng);
        return { ...food, distance: Math.round(distance * 10) / 10 };
      });

      if (radius) {
        foodListings = foodListings.filter((food) => food.distance <= Number(radius));
      }

      foodListings.sort((a, b) => a.distance - b.distance);
    }

    // ✅ NAYA — sirf urgent listings (30 min ya kam bacha hua time)
    if (urgentOnly === "true") {
      const now = new Date();
      foodListings = foodListings.filter((food) => {
        const minutesLeft = (new Date(food.availableUntil) - now) / (1000 * 60);
        return minutesLeft > 0 && minutesLeft <= 30;
      });
    }

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
    // ✅ NAYA — is specific listing ko bhi check kar lo (agar sirf isi ki detail dekhi jaye)
    await expireOldListings();

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