//import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";

// Example placeholder data (to be replaced with API call)
const mockPlant = {
  id: "1",
  name: "Aloe Vera",
  species: "Succulent",
  moisture_threshold: 30,
  automation_watering_enabled: true,
  readings: [
    { value: 28, timestamp: "2025-06-05T14:00:00Z" },
    { value: 31, timestamp: "2025-06-05T13:00:00Z" },
  ],
  alerts: [
    {
      id: 1,
      message: "Moisture below threshold!",
      timestamp: "2025-06-05T14:00:00Z",
    },
  ],
};

function PlantDetailPage() {
  //const { id } = useParams();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="success.main"
        gutterBottom
      >
        {mockPlant.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Species: {mockPlant.species}
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
          defaultValue={mockPlant.moisture_threshold}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch defaultChecked={mockPlant.automation_watering_enabled} />
          }
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
        {mockPlant.readings.map((r, i) => (
          <Typography key={i} variant="body2">
            {new Date(r.timestamp).toLocaleString()}: {r.value}%
          </Typography>
        ))}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alerts
        </Typography>
        {mockPlant.alerts.length > 0 ? (
          mockPlant.alerts.map((a) => (
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
