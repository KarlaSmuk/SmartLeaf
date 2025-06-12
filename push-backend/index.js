const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const dotenv = require("dotenv");
const cors = require("cors");
const WebSocket = require("ws");
dotenv.config();
const notifier = require("node-notifier");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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
  const sub = req.body;
  if (!subscriptions.find((s) => s.endpoint === sub.endpoint)) {
    subscriptions.push(sub);
  }
  res.status(201).json({ message: "Subscription received" });
});

//FOR TESTING PURPOSES
app.post("/mock-alert", (req, res) => {
  const alert = {
    type: req.body.type,
    data: {
      state: req.body.data.state,
      timestamp: req.body.data.timestamp,
      friendly_name: req.body.data.friendly_name,
      unit_of_measurement: req.body.data.unit_of_measurement || undefined,
    },
  };

  if (subscriptions.length === 0) {
    // Local desktop fallback
    notifier.notify({
      title: "🌿 SmartLeaf Alert",
      message: `${alert.data.friendly_name}${alert.data.state ? ":" : ""} ${
        alert.data.state ?? ""
      }`,
      sound: true,
      wait: false,
    });
  } else {
    // Send push to all subscribers
    subscriptions.forEach((sub) => {
      webpush.sendNotification(sub, JSON.stringify(alert)).catch(console.error);
    });
  }
  console.log("Simulated alert sent:", alert);
  res.json({ message: "Simulated alert sent", alert });
});

// Connect to Home Assistant WebSocket API
const haWs = new WebSocket(`ws://${process.env.HA_URL}/api/websocket`);

haWs.on("open", () => {
  console.log("Connected to Home Assistant WebSocket");
});

haWs.on("message", (raw) => {
  const msg = JSON.parse(raw);

  if (msg.type === "auth_required") {
    haWs.send(
      JSON.stringify({ type: "auth", access_token: process.env.HA_TOKEN })
    );
  }

  if (msg.type === "auth_ok") {
    haWs.send(
      JSON.stringify({
        id: 1,
        type: "subscribe_events",
        event_type: "state_changed",
      })
    );
  }

  if (msg.type === "event") {
    const event = msg.event;
    const { entity_id, new_state } = event.data;

    if (entity_id.startsWith("automation.")) {
      const state = new_state.state;
      const timestamp = new_state.last_updated;
      const friendly_name = new_state.attributes.friendly_name;
      const unit_of_measurement = new_state.attributes.unit_of_measurement;

      const alert = {
        type: "sensor_reading",
        data: {
          state,
          timestamp,
          friendly_name,
          unit_of_measurement,
        },
      };

      if (entity_id.includes("watering")) {
        alert = {
          type: "watering_event",
          data: {
            state,
            timestamp,
            friendly_name,
          },
        };
      } else if (entity_id.startsWith("script.water_")) {
        alert = {
          type: "sensor_reading",
          data: {
            state,
            timestamp,
            friendly_name,
            unit_of_measurement,
          },
        };
      }

      console.log("Detected alert:", alert);

      if (subscriptions.length === 0) {
        // Local desktop fallback
        notifier.notify({
          title: "🌿 SmartLeaf Alert",
          message: `${alert.data?.friendly_name || "Sensor"}: ${
            alert.data?.state
          }`,
          sound: true,
          wait: false,
        });
      } else {
        // Send push to all subscribers
        subscriptions.forEach((sub) => {
          webpush
            .sendNotification(sub, JSON.stringify(alert))
            .catch(console.error);
        });
      }
    }
  }
});

haWs.on("error", (err) => console.error("HA WebSocket error:", err));
haWs.on("close", () => console.warn("HA WebSocket closed"));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Push backend listening on http://localhost:${PORT}`);
});
