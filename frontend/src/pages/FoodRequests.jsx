// pages/FoodRequests.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFoodRequests, fulfillFoodRequest } from "../services/foodRequestService";

const FoodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fulfillingId, setFulfillingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const data = await getFoodRequests();
      setRequests(data.foodRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFulfill = async (id) => {
    setFulfillingId(id);
    try {
      await fulfillFoodRequest(id);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Could not fulfill this request.");
    } finally {
      setFulfillingId(null);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Food Requests</h1>
        <Link
          to="/create-request"
          className="text-sm font-medium bg-remeal-green text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">No open food requests right now.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">
                    {req.requiredQuantity} meals · {req.foodType.replace("_", " ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Needed by: {new Date(req.requiredDate).toLocaleDateString()} at{" "}
                    {req.requiredTime}
                  </p>
                  <p className="text-sm text-gray-500">{req.location?.address}</p>
                  {req.purpose && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{req.purpose}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Requested by {req.requesterId?.name}
                  </p>
                </div>
                <span className="text-sm font-bold text-remeal-orange">
                  {req.budget > 0 ? `₹${req.budget}` : "Donation"}
                </span>
              </div>

              <button
                onClick={() => handleFulfill(req._id)}
                disabled={fulfillingId === req._id}
                className="mt-4 bg-remeal-green text-white text-sm px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {fulfillingId === req._id ? "Submitting..." : "I Can Fulfill This"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodRequests;