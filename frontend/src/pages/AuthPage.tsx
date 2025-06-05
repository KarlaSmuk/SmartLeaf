import { useState } from "react";
import {
  Container,
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Alert,
  useMediaQuery,
  useTheme,
  Link,
  Snackbar,
} from "@mui/material";
import AuthForm from "../components/AuthForm";
import { getCurrentUser, saveAccessToken } from "../utils/auth";
import { useNavigate, type ErrorResponse } from "react-router-dom";
import type { AxiosError } from "axios";
import { useUser } from "../hooks/useUser";
import {
  login,
  register,
  type LoginRequest,
  type RegisterRequest,
} from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import leafSvg from "../assets/growth-plant.svg";

function AuthPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { setUser } = useUser();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setErrorMessage("");
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: async (response) => {
      saveAccessToken(response.accessToken);
      const user = await getCurrentUser(); // fetch user from backend

      if (user) {
        setUser(user); // update context
      }
      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setErrorMessage(error.message || "Login failed");
      setShowToast(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      setTab(0);
      setErrorMessage("Account created! Please log in.");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setErrorMessage(error.message || "Registration failed");
      setShowToast(true);
    },
  });

  const handleAuthSubmit = (data: LoginRequest | RegisterRequest) => {
    if (tab === 0) {
      loginMutation.mutate(data as LoginRequest);
    } else {
      registerMutation.mutate(data as RegisterRequest);
    }
  };

  return (
    <Container
      disableGutters
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #d0f0c0, #b2d8b2, #90be6d)", // earthy green tones
      }}
    >
      <Card
        elevation={10}
        sx={{
          position: "relative",
          backdropFilter: "blur(6px)",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 4,
          p: isMobile ? 3 : 4,
          width: isMobile ? "90%" : 420,
          textAlign: "center",
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Leaf logo centered */}
        <img
          src={leafSvg}
          alt="SmartLeaf Logo"
          style={{
            width: 64,
            marginBottom: 12,
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="success.main"
          gutterBottom
        >
          SmartLeaf
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Grow Smart. Monitor Smarter.
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <AuthForm
          mode={tab === 0 ? "login" : "register"}
          onSubmit={handleAuthSubmit}
        />

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowToast(false)}
            severity="error"
            sx={{ bgcolor: "error.light" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Box mt={3}>
          {tab === 0 ? (
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => setTab(1)}
                color="success.main"
              >
                Register
              </Link>
            </Typography>
          ) : (
            <Typography variant="body2">
              Already registered?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => setTab(0)}
                color="success.main"
              >
                Login
              </Link>
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default AuthPage;
