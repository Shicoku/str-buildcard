const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  if (!message) return res.status(400).json({ error: "不正なリクエストです。" });

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
      from: `"${name}"`,
      to: process.env.RECEIVER_EMAIL,
      subject: `お問い合わせ: ビルドカード生成機`,
      text: email + "\n\n" + message,
    });
    res.status(200).send("送信完了");
  } catch (err) {
    console.log(err);
    res.status(500).send("送信失敗");
  }
}
