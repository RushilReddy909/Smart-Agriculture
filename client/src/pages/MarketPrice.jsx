import React, { useState } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";

const MarketPrice = () => {
  const [crop, setCrop] = useState("");
  const [market, setMarket] = useState("");
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5174/api/price/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, market, period }),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container>
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Market Price Predictor
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            AI-powered tool that predicts crop prices based on market trends and demand to help
            farmers sell at the right time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side Form */}
          <Card className="p-6 lg:col-span-1 hover:shadow-lg transition-shadow">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g., Tomato"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market (optional)</label>
                <input
                  type="text"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="e.g., Delhi Azadpur Mandi"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="7d">Next 7 days</option>
                  <option value="14d">Next 14 days</option>
                  <option value="30d">Next 30 days</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Predicting..." : "Predict Price"}
              </button>
            </form>
          </Card>

          {/* Right Side Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prediction Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Prediction</h3>
              {!prediction ? (
                <p className="text-gray-600 mt-2">
                  Fill the form to view forecast. This tool will visualize expected price movement and
                  confidence to help timing your sale.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center hover:bg-green-100 transition-colors">
                    <div className="text-sm text-gray-600">Crop</div>
                    <div className="text-lg font-semibold text-gray-900">{prediction.crop}</div>
                  </div>

                  {prediction.market && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center hover:bg-blue-100 transition-colors">
                      <div className="text-sm text-gray-600">Market</div>
                      <div className="text-lg font-semibold text-gray-900">{prediction.market}</div>
                    </div>
                  )}

                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center hover:bg-purple-100 transition-colors">
                    <div className="text-sm text-gray-600">Predicted Price (₹/kg)</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {prediction.predictedPrice?.toFixed(1)}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Tips Section */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Tips</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-2">
                <li>Track price spikes and plan logistics before peak days.</li>
                <li>Consider storage costs vs. potential gains from waiting.</li>
                <li>Diversify markets: compare nearby mandis for better rates.</li>
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MarketPrice;
