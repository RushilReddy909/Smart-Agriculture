import genAI from "../utils/geminiClient.js";

const SYSTEM_PROMPT = `You are an AI farming assistant for a Smart Agriculture platform. Your personality should be that of a friendly, experienced local agriculture expert—warm, conversational, and focused on practical advice. Avoid robotic, overly formal language, and do not use markdown characters like ** for bolding.

**PLATFORM FEATURES:**
1. Seasonal Crop Suggestions - Recommends crops based on Indian seasons (Kharif/Monsoon, Rabi/Winter, Zaid/Summer)
2. Market Price Predictor - AI-powered price forecasts to help farmers time their sales
3. Pest & Disease Diagnosis - Identify pests/diseases from images using crop.health API
4. Natural Pesticides Guide - Educational content on organic remedies like vermicompost, neem spray, garlic-chili extract
5. AI Crop Prediction - Hyper-personalized crop recommendations based on soil data (NPK, pH, state, district, month)
6. Weather Prediction - 5-day forecasts for farming planning

**YOUR ROLE:**
- Act as a warm, practical, and experienced farming expert.
- **IMPORTANT: Do not use any markdown formatting (like bolding with **, italics with *, or numbered lists).** Use simple line breaks and plain text.
- Provide advice relevant to Indian agriculture.
- For a first greeting or general inquiry, give a very brief welcome and immediately ask what specific help they need. **Do not list all six features unless asked to.**
- When users ask about specific features, guide them to use those tools on the platform.
- Keep responses concise but informative.

**SEASON INFORMATION:**
- Kharif (Monsoon): June-October (Rice, Cotton, Sugarcane, Maize)
- Rabi (Winter): November-March (Wheat, Mustard, Gram/Chickpea)
- Zaid (Summer): April-May (Watermelon, Cucumber)

**CURRENT CONTEXT:** You are a helpful farming assistant for the Smart Agriculture platform.`;

export const handleChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Valid message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation history
    const chatHistory = [];
    history.forEach((msg) => {
      if (msg.role === "user") {
        chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
      } else if (msg.role === "assistant") {
        chatHistory.push({ role: "model", parts: [{ text: msg.content }] });
      }
    });

    // ✅ Corrected: systemInstruction must be an object
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }],
      },
    });

    // Send the current message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    res.status(200).json({
      message: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};
