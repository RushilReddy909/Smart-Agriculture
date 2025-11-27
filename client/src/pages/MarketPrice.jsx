import React, { useState } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import LocationSelector from "../components/ui/LocationSelector";
import PriceTable from "../components/ui/PriceTable";
import useLanguageStore from "../store/useLanguageStore";
import {
  getMandiPrices,
  searchCommodities,
  getStates,
} from "../services/priceService";

const MarketPrice = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useLanguageStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // State is required by the API
    if (!state) {
      setError(
        "State is required. Please enter a state name (e.g., Karnataka, Maharashtra)."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getMandiPrices({ state, district, commodity });
      // Normalize the response - backend returns 'records', frontend expects 'data'
      setPrices({
        ...data,
        data: data.records || data.data || [],
      });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch market prices. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container>
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {t("MarketPricePage.market_price.title")}
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            {t("MarketPricePage.market_price.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side Form */}
          <Card className="p-6 lg:col-span-1 hover:shadow-lg transition-shadow">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <LocationSelector
                state={state}
                district={district}
                onStateChange={(e) => setState(e.target.value)}
                onDistrictChange={(e) => setDistrict(e.target.value)}
                stateLabel="State"
                districtLabel="District"
                stateRequired={true}
                districtRequired={false}
                statePlaceholder="Select State"
                districtPlaceholder="Select District (Optional)"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commodity <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  placeholder="e.g., Tomato, Onion, Wheat"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Get Mandi Prices"}
              </button>
            </form>
          </Card>

          {/* Right Side Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Results Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Mandi Prices
              </h3>
              {prices?.isMockData && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ℹ️{" "}
                    {prices.message ||
                      "Showing sample data. Live API data is currently unavailable."}
                  </p>
                </div>
              )}
              {!prices?.isMockData && prices?.message && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">ℹ️ {prices.message}</p>
                </div>
              )}
              {error ? (
                <p className="text-red-600 mt-2">{error}</p>
              ) : !prices ? (
                <p className="text-gray-600 mt-2">
                  Enter a <strong>State name</strong> (required) and optionally
                  District/Commodity, then click "Get Mandi Prices".
                </p>
              ) : prices.success === false ? (
                <p className="text-red-600 mt-2">{prices.message}</p>
              ) : (
                <PriceTable data={prices?.data} t={t} />
              )}
            </Card>

            {/* Tips Section */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Tips</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-2">
                <li>
                  <strong>State is required</strong> - Start by entering a state
                  name
                </li>
                <li>Add district and commodity to filter results further</li>
                <li>
                  Prices are updated daily from government mandis (AgMarkNet)
                </li>
                <li>
                  Common states: Karnataka, Maharashtra, Punjab, Tamil Nadu
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MarketPrice;
