const axios = require("axios");

module.exports = async (req, res) => {
  const { uid, lang = "jp" } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    const response = await axios.get(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from mihomo", details: error.message });
  }
};
