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
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { triggerWatering, updateThreshold } from "../api/homeAssistant";
import { useAlertContext } from "../context/alert";
import { useSensorValues } from "../hooks/useSensorValues";

function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantEntityId = id ?? "sensor.plant_1";

  const { plants, loading } = useSensorValues();

  //mock data
  const plant = plants.find((e) => e.entity_id === plantEntityId);

  //mock sensor readings instead of websocket

  const [moistureThreshold, setMoistureThreshold] = useState<number>(
    parseFloat(plant?.thresholdsValues.moisture ?? "0")
  );
  const [tempMinTreshold, setTempMinTreshold] = useState<number>(
    parseFloat(plant?.thresholdsValues.temperature_min ?? "0")
  );
  const [tempMaxTreshold, setTempMaxTreshold] = useState<number>(
    parseFloat(plant?.thresholdsValues.temperature_max ?? "0")
  );

  //web socket
  const { alerts: systemAlerts } = useAlertContext();

  if (loading) return <div>Loading sensor values...</div>;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="success.main"
        gutterBottom
      >
        {plant?.friendly_name ?? "Unknown Plant"}
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
        <Card sx={{ px: 2, py: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Environmental Conditions
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                🌡️ {"Temperature"}: {plant?.currentValues.temperature ?? "-"} °C
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                💧 {"Leaf Moisture"}: {plant?.currentValues.moisture ?? "-"} %
              </Typography>

              <Typography variant="body1">
                📈 {"Pressure"}: {plant?.currentValues.pressure ?? "-"} hPa
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Configure Your Environment
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box
            sx={{ display: "flex", alignItems: "baseline" }}
            display={"flex"}
            flexDirection={"column"}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Temperature Threshold
            </Typography>

            <Box display={"flex"} flexDirection="column">
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <TextField
                  fullWidth
                  label="Min Temp (°C)"
                  type="number"
                  value={tempMinTreshold}
                  onChange={(e) =>
                    setTempMinTreshold(parseFloat(e.target.value))
                  }
                  sx={{ width: 120 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateThreshold("input_number.", tempMinTreshold);
                  }}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  Save
                </Button>
              </Box>

              <Box sx={{ mt: 3, display: "flex", alignItems: "baseline" }}>
                <TextField
                  fullWidth
                  label="Max Temp (°C)"
                  type="number"
                  value={tempMaxTreshold}
                  onChange={(e) =>
                    setTempMaxTreshold(parseFloat(e.target.value))
                  }
                  sx={{ width: 120 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateThreshold("input_number.", tempMaxTreshold);
                  }}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Plant Settings
        </Typography>
        <Box display={"flex"} sx={{ mb: 2 }} alignItems={"baseline"} gap={2}>
          <TextField
            fullWidth
            label="Moisture Threshold (%)"
            type="number"
            value={moistureThreshold}
            onChange={(e) => setMoistureThreshold(parseFloat(e.target.value))}
            sx={{ width: 400 }}
          />
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
            Save
          </Button>
        </Box>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Enable Auto Watering"
        />
      </Paper>

      <Box mt={5}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Alerts
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

              if (type === "sensor_reading") {
                return (
                  <Typography
                    key={index}
                    variant="body2"
                    color="error"
                    gutterBottom
                  >
                    ⚠️ {data.friendly_name}: {data.state}
                    {data.unit_of_measurement} —{" "}
                    {new Date(data.timestamp).toLocaleString()}
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
      </Box>
    </Container>
  );
}

export default PlantDetailPage;
