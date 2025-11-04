import genAI from "../utils/geminiClient.js";

export const predictPrice = async (req, res) => {
    try {
      const { crop, market, period } = req.body;
      console.log("✅ /api/price/predict called:", { crop, market, period });
  
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      const historyPrompt = `
        Generate daily wholesale market prices for ${crop} in ${market || "India"} 
        for the past 4 months.
        Respond ONLY in valid JSON array format:
        [
          {"date": "2025-07-01", "price": 22.4},
          {"date": "2025-07-02", "price": 22.6},
          ...
        ]
        Prices should be in ₹/kg and reflect realistic crop price fluctuations.
      `;
  
      const historyResult = await model.generateContent(historyPrompt);
      const historyText = historyResult.response.text();
  
      console.log("🧾 Gemini history response:", historyText.slice(0, 300)); // first 300 chars
  
      const startIdx = historyText.indexOf("[");
      const endIdx = historyText.lastIndexOf("]") + 1;
      const historyJSON = historyText.slice(startIdx, endIdx);
      const priceHistory = JSON.parse(historyJSON);
  
      const lastPrices = priceHistory.slice(-30).map((p) => p.price);
      const avgNow = lastPrices.reduce((sum, v) => sum + v, 0) / lastPrices.length;
  
      const predictPrompt = `
        Based on the last 30 days of prices (₹/kg): [${lastPrices.join(", ")}],
        predict the likely average market price for ${crop} in ${market || "India"}
        after ${period}.
        Respond strictly as JSON:
        {"predictedPrice": number}
      `;
  
      const predictResult = await model.generateContent(predictPrompt);
      const predictText = predictResult.response.text();
  
      console.log("📈 Gemini predict response:", predictText);
  
      const predStart = predictText.indexOf("{");
      const predEnd = predictText.lastIndexOf("}") + 1;
      const forecast = JSON.parse(predictText.slice(predStart, predEnd));
  
      res.status(200).json({
        crop,
        market,
        period,
        predictedPrice: forecast.predictedPrice,
        priceNow: avgNow,
      });
  
    } catch (error) {
      console.error("❌ Error predicting price:", error);
      res.status(500).json({ error: "Failed to predict price" });
    }
  };
  