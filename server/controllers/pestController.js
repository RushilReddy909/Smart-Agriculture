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

export const getTreatmentDetails = async (req, res) => {
  const { entity_id } = req.query;
  
  if (!entity_id) {
    return res.status(400).json({ error: "entity_id is required" });
  }

  const apiKey = process.env.KINDWISE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key not configured" });
  }

  try {
    // Try fetching details from Kindwise API
    // The API might use a details endpoint or include details in the identification response
    // Based on Kindwise API patterns, we'll try multiple approaches
    
    // Approach 1: Try details endpoint
    try {
      const detailsUrl = `https://crop.kindwise.com/api/v1/details/${entity_id}`;
      const response = await axios.get(detailsUrl, {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey
        }
      });
      
      if (response.data && response.data.treatment) {
        return res.json({ treatment: response.data.treatment });
      }
    } catch (detailsErr) {
      // If details endpoint doesn't exist, try alternative
      console.log("Details endpoint not available, trying alternative...");
    }

    // Approach 2: The treatment might be in the initial response structure
    // For now, return empty as the API structure may not support direct treatment fetching
    // In production, you would need to check Kindwise API documentation for the correct endpoint
    res.json({ 
      treatment: [],
      message: "Treatment details endpoint not yet configured. Please check Kindwise API documentation."
    });
    
  } catch (err) {
    console.error("Kindwise Details API Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const payload = err.response?.data || { error: err.message };
    res.status(status).json({ error: "Failed to fetch treatment details", details: payload });
  }
};


