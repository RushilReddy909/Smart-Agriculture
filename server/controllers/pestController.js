import axios from "axios";

export const identifyPest = async (req, res) => {
  const { images, top_n = 1 } = req.body || {}; // Default to 1 for most probable

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "images array (base64) is required" });
  }
  const apiKey = process.env.KINDWISE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key not configured" });
  }

  try {
    // Build URL with query parameters for modifiers
    const url = new URL("https://crop.kindwise.com/api/v1/identification");
    url.searchParams.append("similar_images", "true");
    if (top_n) {
      url.searchParams.append("top_n", top_n.toString());
    }

    const response = await axios.post(
      url.toString(),
      { images },
      { 
        headers: { 
          "Content-Type": "application/json", 
          "Api-Key": apiKey 
        } 
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Kindwise API Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const payload = err.response?.data || { error: err.message };
    res.status(status).json({ error: "Kindwise proxy failed", details: payload });
  }
};
