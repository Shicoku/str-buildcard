const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, ".."));

app.use(connectLivereload());
app.use(cors());
app.use(express.json());
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
    console.log(err);
    res.status(500).send("送信失敗");
  }
});

app.listen(PORT, () => {
  console.log(`テストプロキシ起動中: http://localhost:${PORT}`);
});
