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
- **IMPORTANT: You MUST use standard Markdown link formatting [Link Text](/path) to guide the user to relevant features.** Do not use any other markdown (no bolding, italics, or numbered lists). Use simple line breaks and plain text for everything else.
- The available website paths for links are: /features, /natural-pesticides, /pest-diagnosis, /market-price, /crop-suggestion, /crop-prediction, /weather-prediction, /login, /signup.
- Provide advice relevant to Indian agriculture.
- When users ask about specific features, guide them to use those tools on the platform.
- Keep responses concise but informative.

**SEASON INFORMATION:**
- Kharif (Monsoon): June-October (Rice, Cotton, Sugarcane, Maize)
- Rabi (Winter): November-March (Wheat, Mustard, Gram/Chickpea)
- Zaid (Summer): April-May (Watermelon, Cucumber)

**CURRENT CONTEXT:** You are a helpful farming assistant for the Smart Agriculture platform.`;

export const handleChatMessage = async (req, res) => {
  try {
    const {
      message,
      audio,
      mimeType,
      language = "en",
      history = [],
    } = req.body;

    // Validate input - either text message or audio
    if (!message && !audio) {
      return res
        .status(400)
        .json({ error: "Either message or audio is required" });
    }

    if (message && typeof message !== "string") {
      return res.status(400).json({ error: "Valid message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation history (exclude voice message indicators)
    const chatHistory = [];
    history.forEach((msg) => {
      // Skip voice message indicators in history
      if (msg.content === "🎤 Voice message") return;

      if (msg.role === "user") {
        chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
      } else if (msg.role === "assistant") {
        chatHistory.push({ role: "model", parts: [{ text: msg.content }] });
      }
    });

    let responseText;

    // Handle audio input
    if (audio) {
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audio, "base64");

      // Language map for better context
      const languageNames = {
        en: "English",
        hi: "Hindi",
        tel: "Telugu",
        cha: "Chhattisgarhi",
      };

      const uiLanguage = languageNames[language] || "English";

      // Create prompt for audio transcription and response
      const audioPrompt = `The user interface language is ${uiLanguage}, but please transcribe and respond in whatever language is actually spoken in this audio clip. Maintain your role as a helpful farming assistant. Listen to the audio and provide a natural, helpful response.`;

      // Send audio with system instruction
      const result = await model.generateContent([
        {
          inlineData: {
            data: audioBuffer.toString("base64"),
            mimeType: mimeType || "audio/webm",
          },
        },
        audioPrompt,
        `System context: ${SYSTEM_PROMPT}`,
      ]);

      const response = await result.response;
      responseText = response.text();
    } else {
      // Handle text message (existing logic)
      const chat = model.startChat({
        history: chatHistory,
        systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      responseText = response.text();
    }

    res.status(200).json({
      message: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};
