const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/vapidPublicKey", (req, res) => {
  res.json({ vapidPublicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription received" });
});

app.post("/notify", async (req, res) => {
  const { title = "SmartLeaf Alert", body = "Something happened!" } = req.body;
  console.log("Sending notification:", { title, body });
  const payload = JSON.stringify({ title, body });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  }

  res.json({ message: "Notifications sent" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Push backend listening on http://localhost:${PORT}`);
});
