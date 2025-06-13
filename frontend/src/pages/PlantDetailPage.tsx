import {
  Container,
  Typography,
  Divider,
  Paper,
  TextField,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { triggerWatering, updateThreshold } from "../api/homeAssistant";
import { useAlertContext } from "../context/alert";
import { useSensorValues } from "../hooks/useSensorValues";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHomeAssistantWebSocket } from "../hooks/useHomeAssistantWebSocket";

function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantEntityId = id ?? "sensor.plant_1";
  const navigate = useNavigate();

  useHomeAssistantWebSocket((entity_id, state) => {
    console.log("🌡️ Received threshold update:", entity_id, state);
    if (entity_id.includes("moisture")) {
      setMoistureThreshold(parseFloat(state));
    } else if (entity_id.includes("temperature_min")) {
      setTempMinTreshold(parseFloat(state));
    } else if (entity_id.includes("temperature_max")) {
      setTempMaxTreshold(parseFloat(state));
    }
  });
  const { plants, loading } = useSensorValues();

  //mock data
  const plant = plants.find((e) => e.entity_id === plantEntityId);

  //mock sensor readings instead of websocket
  const [moistureThreshold, setMoistureThreshold] = useState<number>(0);
  const [tempMinTreshold, setTempMinTreshold] = useState<number>(0);
  const [tempMaxTreshold, setTempMaxTreshold] = useState<number>(0);
  const [wateringDuration, setWateringDuration] = useState<number>(5); // default 5 sec

  //web socket
  const { alerts: systemAlerts } = useAlertContext();

  useEffect(() => {
    if (plant?.thresholdsValues.moisture && moistureThreshold === 0) {
      setMoistureThreshold(parseFloat(plant.thresholdsValues.moisture));
      setTempMinTreshold(parseFloat(plant.thresholdsValues.temperature_min));
      setTempMaxTreshold(parseFloat(plant.thresholdsValues.temperature_max));
    }
  }, [plant]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box display="flex" flexDirection={"row"} gap={2}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ alignSelf: "flex-start", mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          fontWeight={700}
          color="success.main"
          gutterBottom
        >
          {plant?.friendly_name ?? "Unknown Plant"}
        </Typography>
      </Box>

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
        <Typography variant="h5" fontWeight={600} gutterBottom>
          🌿 Plant Configuration & Environment
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>
              🌡️ Temperature:{" "}
              <span
                style={{
                  color:
                    plant!.currentValues.temperature <
                      Number(plant?.thresholdsValues.temperature_min) ||
                    plant!.currentValues.temperature >
                      Number(plant?.thresholdsValues.temperature_max)
                      ? "red"
                      : "inherit",
                }}
              >
                {plant?.currentValues.temperature ?? "-"} °C
              </span>
            </Typography>
            <Typography>
              💧 Leaf Moisture:{" "}
              <span
                style={{
                  color:
                    plant!.currentValues.moisture <
                    Number(plant?.thresholdsValues.moisture)
                      ? "red"
                      : "inherit",
                }}
              >
                {plant?.currentValues.moisture ?? "-"} %
              </span>
            </Typography>
            <Typography>
              📈 Air Pressure: {plant?.currentValues.pressure ?? "-"} hPa
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight={550} mb={1.5}>
          Set Thresholds
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
                  label="Min (°C)"
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
                    updateThreshold(
                      plant!.thresholds.temperature_min,
                      tempMinTreshold
                    );
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
                  label="Max (°C)"
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
                    updateThreshold(
                      plant!.thresholds.temperature_max,
                      tempMaxTreshold
                    );
                  }}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Leaf Moisture Threshold
            </Typography>

            <Box display={"flex"} flexDirection="column">
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <TextField
                  fullWidth
                  label="Moisture (%)"
                  type="number"
                  value={moistureThreshold}
                  onChange={(e) =>
                    setMoistureThreshold(parseFloat(e.target.value))
                  }
                  sx={{ width: 120 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateThreshold(
                      plant!.thresholds.moisture,
                      moistureThreshold
                    );
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

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          💧 Manual Watering Control
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Set the watering duration and start watering manually.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Watering Duration"
            type="number"
            size="small"
            value={wateringDuration}
            onChange={(e) => setWateringDuration(parseInt(e.target.value, 10))}
            sx={{ width: 200 }}
            InputProps={{
              endAdornment: <Typography sx={{ ml: 1 }}>seconds</Typography>,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={async () => {
              await updateThreshold(plant!.watering.duration, wateringDuration);
              await updateThreshold(plant!.watering.start, 1);
            }}
          >
            Start Watering
          </Button>
        </Box>
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
                  <Typography
                    key={index}
                    variant="body2"
                    color="info.main"
                    gutterBottom
                  >
                    💧 {data.friendly_name} —{" "}
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
