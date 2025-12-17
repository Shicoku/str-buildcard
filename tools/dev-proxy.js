// dev-proxy.js (ESM版)

import livereload from "livereload";
import connectLivereload from "connect-livereload";
import express from "express";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// __dirname を ESM で使えるようにする
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

// LiveReload サーバー
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, ".."));

app.use(connectLivereload());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Mihomo API プロキシ
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

// フィードバック送信
app.post("/api/feedback", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `お問い合わせ: ビルドカード生成機`,
      text: email + "\n\n" + message,
    });
    res.status(200).send("送信完了");
  } catch (err) {
    console.error(err);
    res.status(500).send("送信失敗");
  }
});

// サーバー起動
app.listen(PORT, "0.0.0.0", () => {
  console.log(`テストプロキシ起動中: http://localhost:${PORT}`);
});
