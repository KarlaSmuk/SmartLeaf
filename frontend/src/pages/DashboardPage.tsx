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
import type { HAEntity } from "../api/homeAssistant";

export const mockPlants: HAEntity[] = [
  {
    entity_id: "sensor.plant_1_moisture",
    state: "27",
    attributes: {
      friendly_name: "Aloe Vera",
      moisture: 27,
      species: "Succulent",
      moisture_threshold: 30,
      automation_watering_enabled: true,
      plant_id: "1",
      timestamp: "2025-06-05T14:00:00Z",
    },
  },
  {
    entity_id: "sensor.plant_2_moisture",
    state: "55",
    attributes: {
      friendly_name: "Tomato Plant",
      moisture: 55,
      species: "Solanum Lycopersicum",
      moisture_threshold: 50,
      automation_watering_enabled: false,
      plant_id: "2",
      timestamp: "2025-06-05T14:10:00Z",
    },
  },
];

const airEntities: HAEntity[] = [
  {
    entity_id: "sensor.air_temperature",
    state: "23.1",
    attributes: {
      friendly_name: "Room Air Temperature",
      temperature: 23.1,
      timestamp: "2025-06-06T08:30:00Z",
    },
  },
  {
    entity_id: "sensor.air_humidity",
    state: "45",
    attributes: {
      friendly_name: "Room Humidity",
      humidity: 45,
      timestamp: "2025-06-06T08:30:00Z",
    },
  },
  {
    entity_id: "sensor.air_pressure",
    state: "1015",
    attributes: {
      friendly_name: "Room Air Pressure",
      pressure: 1015,
      timestamp: "2025-06-06T08:30:00Z",
    },
  },
];

function DashboardPage() {
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
        {mockPlants.map((plant) => (
          <Box
            key={plant.entity_id}
            flexBasis={{ xs: "100%", sm: "48%", md: "30%" }}
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
                    onClick={() =>
                      alert(`Trigger watering for ${plant.entity_id}`)
                    }
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
            System Logs or Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No alerts at the moment.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default DashboardPage;
