import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Button,
} from "@mui/material";
import leafSvg from "../assets/growth-plant.svg";
import { useNavigate } from "react-router-dom";
import { triggerWatering } from "../api/homeAssistant";
import { useAlertContext } from "../context/alert";
import { initialPlantsData } from "../api/plants";

function DashboardPage() {
  const navigate = useNavigate();

  const { alerts: systemAlerts } = useAlertContext();

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
        {initialPlantsData.map((plant) => (
          <Box
            onClick={() => navigate(`/plant/${plant.entity_id}`)}
            key={plant.entity_id}
            flexBasis={{ xs: "100%", sm: "48%", md: "30%" }}
            sx={{ cursor: "pointer" }}
          >
            <Card
              elevation={3}
              sx={{
                height: "100%",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" color="success.main" gutterBottom>
                  {plant.friendly_name ?? plant.entity_id}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerWatering(plant.entity_id);
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

export default DashboardPage;
