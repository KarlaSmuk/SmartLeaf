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
import { getMockPlantEntities } from "../api/homeAssistant";

function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantId = id ?? "sensor.plant_1";

  //mock data
  const plant = getMockPlantEntities().find((e) => e.entity_id === plantId);
  //mock sensor readings instead of websocket


  const [readings, setReadings] = useState<
    { value: number; timestamp: string }[]
  >([]);
  const [alerts, setAlerts] = useState<
    { id: number; message: string; timestamp: string }[]
  >([]);
  const [moistureThreshold, setMoistureThreshold] = useState<number>(30);

  useEffect(() => {
    if (!plant) return;

    const value = parseFloat(plant.state);
    const timestamp = new Date().toISOString();

    if (!isNaN(value)) {
      setReadings((prev) => [{ value, timestamp }, ...prev]);

      if (value < moistureThreshold) {
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
  }, [plant, moistureThreshold]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="success.main"
        gutterBottom
      >
        {plant?.attributes.friendly_name ?? "Unknown Plant"}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Species: {plant?.attributes.species ?? "N/A"}
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
          value={moistureThreshold}
          onChange={(e) => setMoistureThreshold(parseFloat(e.target.value))}
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
