import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import leafSvg from "../assets/growth-plant.svg";
import { useNavigate } from "react-router-dom";
import {
  getMockAirEntities,
  getMockPlantEntities,
  getMockSensorAlerts,
} from "../api/homeAssistant";

function DashboardPage() {
  const navigate = useNavigate();

  //mock data
  const airEntities = getMockAirEntities();
  const plants = getMockPlantEntities();
  const systemAlerts = getMockSensorAlerts();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <img src={leafSvg} alt="SmartLeaf" style={{ width: 40 }} />
        <Typography variant="h4" fontWeight={700} color="success.main">
          SmartLeaf Dashboard
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Monitor all your plants below.
      </Typography>

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
      </Paper>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        mt={2}
        justifyContent="flex-start"
      >
        {plants.map((plant) => (
          <Box
            onClick={() => navigate(`/plant/${plant.entity_id}`)}
            key={plant.entity_id}
            flexBasis={{ xs: "100%", sm: "48%", md: "30%" }}
            sx={{ cursor: "pointer" }}
          >
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  {plant.attributes.friendly_name ?? plant.entity_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Species: {plant.attributes.species ?? "N/A"}
                </Typography>
                <Typography variant="body2">
                  Moisture threshold:{" "}
                  {plant.attributes.moisture_threshold ?? "N/A"}%
                </Typography>
                <Typography variant="body2">
                  Last reading: {plant.attributes.moisture ?? "N/A"}% at{" "}
                  {plant.attributes.timestamp
                    ? new Date(plant.attributes.timestamp).toLocaleTimeString()
                    : "N/A"}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={
                      plant.attributes.automation_watering_enabled
                        ? "Automation: ON"
                        : "Automation: OFF"
                    }
                    color={
                      plant.attributes.automation_watering_enabled
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Trigger watering for ${plant.entity_id}`);
                    }}
                  >
                    💧 Manual Watering
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

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
      </Box>
    </Container>
  );
}

export default DashboardPage;
