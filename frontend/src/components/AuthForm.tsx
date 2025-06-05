import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { LoginRequest, RegisterRequest } from "../api/auth";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (
    data: LoginRequest | RegisterRequest,
    mode: "login" | "register"
  ) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      onSubmit({ email, password } as LoginRequest, mode);
    } else {
      onSubmit({ email, fullName, password } as RegisterRequest, mode);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
        padding: isMobile ? theme.spacing(2) : theme.spacing(4),
        borderRadius: theme.spacing(2),
        backgroundColor: "rgba(240, 255, 240, 0.2)", // subtle leafy background
      }}
      noValidate
    >
      <Stack spacing={2}>
        {mode === "register" && (
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.85)",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <FormControl
          variant="outlined"
          fullWidth
          required
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        >
          <InputLabel htmlFor="auth-password">Password</InputLabel>
          <OutlinedInput
            id="auth-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!password || (mode === "register" && (!fullName || !email))}
        sx={{
          mt: theme.spacing(2),
          bgcolor: "success.main",
          color: "white",
          textTransform: "none",
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 128, 0, 0.2)",
          "&:hover": {
            bgcolor: "success.dark",
          },
        }}
      >
        {mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
