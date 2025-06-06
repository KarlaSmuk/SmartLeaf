import { Box, Typography, Container, Button } from "@mui/material";
import leafSvg from "../assets/growth-plant.svg";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <img src={leafSvg} alt="SmartLeaf Logo" style={{ width: 80 }} />

      <Typography variant="h3" fontWeight={700} color="success.main">
        Welcome to SmartLeaf 🌿
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" maxWidth={500}>
        Monitor your plants, manage watering and grow smarter with real-time IoT
        insights.
      </Typography>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
