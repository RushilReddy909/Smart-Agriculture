import React, { useState } from "react";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import axios from "axios";

const CropAi = () => {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    ph: "",
    state: "",
    district: "",
    month: "",
  });
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction("");
    setIsLoading(true);

    const body = {
      nitrogen: parseFloat(formData.nitrogen),
      phosphorous: parseFloat(formData.phosphorous),
      potassium: parseFloat(formData.potassium),
      ph: parseFloat(formData.ph),
      state: formData.state,
      district: formData.district,
      month: formData.month,
    };

    try {
      const response = await axios.post("/predict", body);
      setPrediction(response.data.result);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          AI Crop Recommendation
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            placeholder="Nitrogen Content (e.g., 83)"
            required
          />
          <Input
            type="number"
            name="phosphorous"
            value={formData.phosphorous}
            onChange={handleChange}
            placeholder="Phosphorous Content (e.g., 45)"
            required
          />
          <Input
            type="number"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            placeholder="Potassium Content (e.g., 35)"
            required
          />
          <Input
            type="number"
            step="0.1"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            placeholder="Soil pH (e.g., 6.7)"
            required
          />
          <Input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State (e.g., Maharashtra)"
            required
          />
          <Input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District (e.g., Pune)"
            required
          />
          <Input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="Month (e.g., June)"
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Get Recommendation"}
          </Button>
        </form>

        {prediction && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded text-center">
            <h2 className="text-lg font-semibold">Recommended Crop:</h2>
            <p className="text-2xl font-bold capitalize">{prediction}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded text-center">
            <h2 className="font-bold">Error</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CropAi;
