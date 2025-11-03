import axios from "axios";

export const identifyPest = async (req, res) => {
  const { images, details = ["url", "treatment", "description", "symptoms", "severity"], top_n = 3 } = req.body || {};

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "images array (base64) is required" });
  }
  const apiKey = process.env.KINDWISE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key not configured" });
  }

  try {
    const response = await axios.post(
      "https://crop.health/api/v1/identification",
      { images, details, top_n },
      { headers: { "Content-Type": "application/json", "Api-Key": apiKey } }
    );

    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const payload = err.response?.data || { error: err.message };
    res.status(status).json({ error: "Kindwise proxy failed", details: payload });
  }
};


