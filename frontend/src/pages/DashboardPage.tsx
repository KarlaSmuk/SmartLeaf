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

const mockPlants = [
  {
    id: "1",
    name: "Aloe Vera",
    species: "Succulent",
    moisture_threshold: 30,
    automation_watering_enabled: true,
    latest_reading: {
      type: "moisture",
      value: 27,
      timestamp: "2025-06-05T14:00:00Z",
    },
  },
  {
    id: "2",
    name: "Tomato Plant",
    species: "Solanum Lycopersicum",
    moisture_threshold: 50,
    automation_watering_enabled: false,
    latest_reading: {
      type: "moisture",
      value: 55,
      timestamp: "2025-06-05T14:10:00Z",
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

      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        mt={2}
        justifyContent="flex-start"
      >
        {mockPlants.map((plant) => (
          <Box key={plant.id} flexBasis={{ xs: "100%", sm: "48%", md: "30%" }}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  {plant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Species: {plant.species}
                </Typography>
                <Typography variant="body2">
                  Moisture threshold: {plant.moisture_threshold}%
                </Typography>
                <Typography variant="body2">
                  Last reading: {plant.latest_reading?.value ?? "N/A"}% at{" "}
                  {plant.latest_reading?.timestamp
                    ? new Date(
                        plant.latest_reading.timestamp
                      ).toLocaleTimeString()
                    : "N/A"}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={
                      plant.automation_watering_enabled
                        ? "Automation: ON"
                        : "Automation: OFF"
                    }
                    color={
                      plant.automation_watering_enabled ? "success" : "default"
                    }
                    size="small"
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => alert(`Trigger watering for ${plant.name}`)}
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
