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
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMockAirEntities,
  getMockLeafMoistureHistory,
  getMockPlantEntities,
  triggerWatering,
  updateThreshold,
} from "../api/homeAssistant";
import { getMockSensorAlerts } from "../hooks/useHomeAssistantWebSocket";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantEntityId = id ?? "sensor.plant_1";

  //mock data
  const plant = getMockPlantEntities().find(
    (e) => e.entity_id === plantEntityId
  );
  const airEntities = getMockAirEntities();

  //mock sensor readings instead of websocket

  const historyReadings = getMockLeafMoistureHistory();
  const systemAlerts = getMockSensorAlerts();
  const [moistureThreshold, setMoistureThreshold] = useState<number>(30);
  const [tempMinTreshold, setTempMinTreshold] = useState<number>(30);
  const [tempMaxTreshold, setTempMaxTreshold] = useState<number>(50);
  const [humidityThreshold, setHumidityThreshold] = useState<number>(30);
  const [pressureThreshold, setPressureThreshold] = useState<number>(30);

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

      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={(e) => {
          e.stopPropagation();
          triggerWatering(plantEntityId);
        }}
      >
        💧 Manual Watering
      </Button>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          🌬️ Environmental Conditions
        </Typography>
        <Typography variant="body2">
          🌡️ {airEntities[0]?.attributes.friendly_name ?? "-"}:{" "}
          {airEntities[0]?.attributes.temperature ?? "-"} °C
        </Typography>
        <Typography variant="body2">
          💧 {airEntities[1]?.attributes.friendly_name ?? "-"}:{" "}
          {airEntities[1]?.attributes.humidity ?? "-"} %
        </Typography>
        <Typography variant="body2">
          📈 {airEntities[2]?.attributes.friendly_name ?? "-"}:{" "}
          {airEntities[2]?.attributes.pressure ?? "-"} hPa
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "baseline" }}
            display={"flex"}
            flexDirection={"column"}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Room Temperature Threshold
            </Typography>

            <Box display={"flex"} flexDirection="column">
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <TextField
                  fullWidth
                  label="Min Threshold (°C)"
                  type="number"
                  value={tempMinTreshold}
                  onChange={(e) =>
                    setTempMinTreshold(parseFloat(e.target.value))
                  }
                  sx={{ width: "180px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateThreshold("input_number.", tempMinTreshold);
                  }}
                  sx={{ ml: 2 }}
                >
                  Save
                </Button>
              </Box>

              <Box sx={{ mt: 3, display: "flex", alignItems: "baseline" }}>
                <TextField
                  fullWidth
                  label="Max Threshold (°C)"
                  type="number"
                  value={tempMaxTreshold}
                  onChange={(e) =>
                    setTempMaxTreshold(parseFloat(e.target.value))
                  }
                  sx={{ width: "180px", gap: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateThreshold("input_number.", tempMaxTreshold);
                  }}
                  sx={{ ml: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Room Humidity Threshold
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <TextField
                fullWidth
                label="Humidity Threshold (%)"
                type="number"
                value={humidityThreshold}
                onChange={(e) =>
                  setHumidityThreshold(parseFloat(e.target.value))
                }
                sx={{ width: "180px", height: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateThreshold("input_number.", humidityThreshold);
                }}
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Room Air Pressure Threshold
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <TextField
                fullWidth
                label="Air Pressure Threshold (hPa)"
                type="number"
                value={pressureThreshold}
                onChange={(e) =>
                  setPressureThreshold(parseFloat(e.target.value))
                }
                sx={{ mb: 2, width: "200px", height: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateThreshold("input_number.", pressureThreshold);
                }}
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              updateThreshold(
                "input_number.plant1_moisture_threshold",
                moistureThreshold
              );
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Leaf Moisture (Last 7 Days)
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={historyReadings
              .filter((r) => {
                const date = new Date(r.timestamp);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return date >= sevenDaysAgo;
              })
              .sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              )}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2e7d32"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alerts
        </Typography>
        {systemAlerts.length > 0 ? (
          systemAlerts.map((alert, index) => {
            const { type, data } = alert;

            if (type === "watering_event") {
              return (
                <Typography key={index} variant="body2" color="info.main">
                  💧 {data.message} —{" "}
                  {new Date(data.timestamp).toLocaleTimeString()}
                </Typography>
              );
            }

            if (type === "sensor_reading" && data.alert) {
              const label =
                data.alert === "above"
                  ? "is above the recommended value"
                  : "is below the recommended value";

              // Add units based on sensor_type
              let unit = "";
              switch (data.sensor_type) {
                case "temperature":
                  unit = "°C";
                  break;
                case "humidity":
                case "moisture":
                  unit = "%";
                  break;
                case "pressure":
                  unit = "hPa";
                  break;
              }

              return (
                <Typography
                  key={index}
                  variant="body2"
                  color="error"
                  gutterBottom
                >
                  ⚠️ {data.friendly_name ?? data.sensor_type} {label}:{" "}
                  {data.value}
                  {unit} — {new Date(data.timestamp).toLocaleString()}
                </Typography>
              );
            }

            return null;
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No alerts at the moment.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default PlantDetailPage;
