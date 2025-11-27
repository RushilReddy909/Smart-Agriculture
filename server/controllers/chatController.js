import genAI from "../utils/geminiClient.js";

// Retry utility with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;

      // Don't retry on quota exceeded (429) or invalid requests (400)
      const shouldNotRetry =
        error.status === 429 ||
        error.status === 400 ||
        error.message?.includes("quota") ||
        error.message?.includes("API key");

      // Only retry on temporary overload (503)
      const isRetryable =
        error.status === 503 || error.message?.includes("overloaded");

      if (shouldNotRetry || !isRetryable || isLastAttempt) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(
        `⏳ Model overloaded, retrying in ${delay}ms... (attempt ${
          attempt + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const SYSTEM_PROMPT = `You are an AI farming assistant for a Smart Agriculture platform. Your personality should be that of a friendly, experienced local agriculture expert—warm, conversational, and focused on practical advice. Avoid robotic, overly formal language, and do not use markdown characters like ** for bolding.

**PLATFORM FEATURES (What Each Page Does):**
1. Seasonal Crop Suggestions (/crop-suggestion) - Browse crops by Indian seasons (Kharif/Monsoon, Rabi/Winter, Zaid/Summer). Shows suitable crops for each season with basic details.

2. Market Price Predictor (/market-price) - Check real-time mandi prices from government data (AgMarkNet). Users can filter by state, district, and commodity to see current min/max/modal prices. This helps farmers decide when to sell their produce.

3. Pest & Disease Diagnosis (/pest-diagnosis) - Upload crop leaf/plant images to identify diseases or pest infestations using AI image recognition. It identifies the problem but does NOT provide treatment steps.

4. Natural Pesticides Guide (/natural-pesticides) - Educational library of organic remedies and treatments. Includes recipes for neem spray, garlic-chili extract, vermicompost, bordeaux mixture, and other natural solutions. This is where farmers learn HOW to treat problems.

5. AI Crop Prediction (/crop-prediction) - Personalized crop recommendations based on detailed inputs: soil nutrients (N, P, K levels), soil pH, temperature, humidity, rainfall, state, district, and planting month. Uses ML models to suggest the best crops for specific conditions.

6. Weather Prediction (/weather-prediction) - 5-day weather forecasts with temperature, rainfall predictions, humidity, and farming advisories. Helps plan irrigation, spraying, and harvesting activities.

**YOUR ROLE & RESPONSE STRATEGY:**
- Act as a warm, practical, and experienced farming expert who EDUCATES first, then directs to tools.
- **CRITICAL: ALWAYS provide helpful information and context BEFORE suggesting a tool.** Don't just redirect immediately.
- **IMPORTANT: You MUST use standard Markdown link formatting [Link Text](/path) to guide users to relevant features.** Do not use any other markdown (no bolding, italics, or numbered lists). Use simple line breaks and plain text for everything else.
- Available paths: /features, /natural-pesticides, /pest-diagnosis, /market-price, /crop-suggestion, /crop-prediction, /weather-prediction, /login, /signup

**RESPONSE EXAMPLES:**
Bad: "You can check pest diagnosis feature for that. [Pest Diagnosis](/pest-diagnosis)"

Good: "Tomato leaf curl is often caused by whiteflies spreading viral infections. Look for yellowing, curled leaves, and stunted growth. To treat this, remove affected leaves immediately, spray neem oil solution (30ml neem oil + 1L water) every 3-4 days, and use yellow sticky traps to catch whiteflies. For more natural remedies, check out our [Natural Pesticides Guide](/natural-pesticides). If you want to identify the exact disease from a photo, you can use our [Pest Diagnosis tool](/pest-diagnosis)."

**GUIDELINES:**
- For disease/pest questions: First explain symptoms, causes, and treatment steps (organic methods preferred), THEN mention diagnosis tool and natural pesticides page.
- For crop selection: Explain factors to consider (season, soil, climate, market demand), THEN suggest crop prediction or seasonal suggestions tools.
- For pricing: Explain market timing strategies and factors affecting prices, THEN direct to market price tool.
- For weather: Give general advice about weather-dependent farming tasks, THEN mention weather prediction tool.
- Always prioritize being educational and helpful over just linking pages.

**SEASON INFORMATION:**
- Kharif (Monsoon): June-October (Rice, Cotton, Sugarcane, Maize, Groundnut, Soybean)
- Rabi (Winter): November-March (Wheat, Mustard, Gram/Chickpea, Barley, Peas)
- Zaid (Summer): April-May (Watermelon, Cucumber, Muskmelon, Bitter Gourd)

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

    // Use stable free tier model - gemini-1.5-flash-latest
    // gemini-2.0-flash-exp has quota limit of 0 on free tier
    const modelName = "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

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

      // Send audio with retry mechanism
      const result = await retryWithBackoff(async () => {
        return await model.generateContent([
          {
            inlineData: {
              data: audioBuffer.toString("base64"),
              mimeType: mimeType || "audio/webm",
            },
          },
          audioPrompt,
          `System context: ${SYSTEM_PROMPT}`,
        ]);
      });

      const response = await result.response;
      responseText = response.text();
    } else {
      // Handle text message with retry mechanism
      const chat = model.startChat({
        history: chatHistory,
        systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      });

      const result = await retryWithBackoff(async () => {
        return await chat.sendMessage(message);
      });

      const response = await result.response;
      responseText = response.text();
    }

    res.status(200).json({
      message: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Chat error:", error);

    // Provide user-friendly error messages
    let errorMessage =
      "I'm having trouble connecting right now. Please try again in a moment.";

    if (error.status === 503 || error.message?.includes("overloaded")) {
      errorMessage =
        "The AI service is currently busy. Please try again in a few seconds.";
    } else if (error.status === 429) {
      errorMessage =
        "Too many requests. Please wait a moment before trying again.";
    } else if (error.message?.includes("API key")) {
      errorMessage = "Configuration error. Please contact support.";
    }

    res.status(error.status || 500).json({
      error: errorMessage,
      technical:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
