const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, ".."));

app.use(connectLivereload());
app.use(cors());
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/mihomo", async (req, res) => {
  const { uid, lang = "jp" } = req.query;
  const url = `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "API取得失敗", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`テストプロキシ起動中: http://localhost:${PORT}`);
});
