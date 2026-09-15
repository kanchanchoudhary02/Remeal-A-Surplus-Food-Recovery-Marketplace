// @route   PUT /api/food-requests/:id/fulfill
// @access  Private
const fulfillFoodRequest = async (req, res) => {
  try {
    const foodRequest = await FoodRequest.findById(req.params.id);

    if (!foodRequest) {
      return res.status(404).json({
        success: false,
        message: "Food request not found",
      });
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createFoodRequest,
  getFoodRequests,
  getMyFoodRequests,
  fulfillFoodRequest,
};