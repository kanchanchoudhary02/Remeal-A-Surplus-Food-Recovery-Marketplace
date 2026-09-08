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
    const { search, foodType, listingType, isFree, maxPrice, lat, lng, radius } = req.query;

    const query = { status: "ACTIVE" };
    if (search) query.title = { $regex: search, $options: "i" };
    if (foodType) query.foodType = foodType;
    if (listingType) query.listingType = listingType;
    if (isFree === "true") query.price = 0;
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    // ✅ .lean() — Mongoose documents ki jagah plain JavaScript objects deta hai.
    // Isse fayda: hum inme aage naye fields (jaise "distance") aasani se add kar sakte hain.
    let foodListings = await FoodListing.find(query)
      .populate("providerId", "name providerType")
      .sort({ createdAt: -1 })
      .lean();

    // ✅ NAYA — agar buyer ki location di gayi hai, har listing ka distance calculate karo
    if (lat && lng) {
      const buyerLat = Number(lat);
      const buyerLng = Number(lng);

      foodListings = foodListings.map((food) => {
        const [foodLng, foodLat] = food.pickupLocation.coordinates.coordinates;
        const distance = getDistanceInKm(buyerLat, buyerLng, foodLat, foodLng);
        return { ...food, distance: Math.round(distance * 10) / 10 }; // 1 decimal tak round
      });

      // ✅ Optional radius filter — "sirf X km ke andar wale dikhao"
      if (radius) {
        foodListings = foodListings.filter((food) => food.distance <= Number(radius));
      }

      // ✅ Nearest food sabse pehle dikhao
      foodListings.sort((a, b) => a.distance - b.distance);
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