import {
  Container,
  Typography,
  Divider,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHomeAssistantWebSocket } from "../hooks/useHomeAssistantWebSocket";

function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantId = id ?? "1"; // fallback if not defined
  const { latest } = useHomeAssistantWebSocket();

  const [readings, setReadings] = useState<
    { value: number; timestamp: string }[]
  >([
    { value: 28, timestamp: "2025-06-05T14:00:00Z" },
    { value: 31, timestamp: "2025-06-05T13:00:00Z" },
  ]);

  const [alerts, setAlerts] = useState<
    { id: number; message: string; timestamp: string }[]
  >([
    {
      id: 1,
      message: "Moisture below threshold!",
      timestamp: "2025-06-05T14:00:00Z",
    },
  ]);

  const moistureThreshold = 30;

  useEffect(() => {
    if (!latest || !latest.data) return;
    if (latest.data.plant_id && latest.data.plant_id !== plantId) return;

    const timestamp = latest.data.timestamp ?? new Date().toISOString();

    if (latest.type === "sensor_reading" && latest.data.value !== undefined) {
      setReadings((prev) => [
        { value: latest.data.value!, timestamp },
        ...prev,
      ]);

      if (latest.data.value < moistureThreshold) {
        setAlerts((prev) => [
          {
            id: Date.now(),
            message: "Moisture below threshold!",
            timestamp,
          },
          ...prev,
        ]);
      }
    }

    if (latest.type === "watering_event") {
      setAlerts((prev) => [
        {
          id: Date.now(),
          message: "Watering started.",
          timestamp,
        },
        ...prev,
      ]);
    }
  }, [latest, plantId]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="success.main"
        gutterBottom
      >
        Aloe Vera
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Species: Succulent
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Plant Settings
        </Typography>
        <TextField
          fullWidth
          label="Moisture Threshold (%)"
          type="number"
          defaultValue={moistureThreshold}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Enable Auto Watering"
        />
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Readings
        </Typography>
        {readings.map((r, i) => (
          <Typography key={i} variant="body2">
            {new Date(r.timestamp).toLocaleString()}: {r.value}%
          </Typography>
        ))}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alerts
        </Typography>
        {alerts.length > 0 ? (
          alerts.map((a) => (
            <Typography key={a.id} variant="body2" color="error">
              ⚠️ {a.message} — {new Date(a.timestamp).toLocaleString()}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No alerts.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default PlantDetailPage;
