// pages/Home.jsx

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Where Surplus Food Finds Its <span className="text-remeal-green">Next Meal</span>
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        ReMeal connects restaurants, caterers, and event organizers with safe surplus food
        to people and organizations who need it — before it goes to waste.
      </p>
      <div className="flex justify-center gap-4">
        <button className="bg-remeal-green text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
          Find Surplus Food
        </button>
        <button className="border-2 border-remeal-green text-remeal-green px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
          Become a Provider
        </button>
      </div>
    </div>
  );
};

export default Home;