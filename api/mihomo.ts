// import axios from "axios";

// export default async function handler(req, res) {
//   const { uid, lang = "jp" } = req.query;

//   if (!uid) {
//     return res.status(400).json({ error: "UID is required" });
//   }

//   try {
//     const response = await axios.get(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: "APIエラー", details: error.message });
//   }
// }

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, lang = "jp" } = req.query;
  if (typeof uid !== "string") {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    const response = await axios.get(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "APIエラー", details: error.message });
  }
}
