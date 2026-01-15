import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ApiError } from "../api";
import { useAuth } from "../hooks/useAuth";
import { loginPageTestIds } from "@testIds/loginPageTestIds";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        data-testid={loginPageTestIds.heading}
      >
        Sign In
      </Typography>

      <Typography
        data-testid={loginPageTestIds.description}
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Welcome back to Team Time
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          data-testid={loginPageTestIds.error}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email")}
          data-testid={loginPageTestIds.email}
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
        />

        <TextField
          {...register("password")}
          data-testid={loginPageTestIds.password}
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          data-testid={loginPageTestIds.submitButton}
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center">
        <Link
          to="/"
          style={{ color: "inherit" }}
          data-testid={loginPageTestIds.backToHome}
        >
          Back to home
        </Link>
      </Typography>
    </Box>
  );
}
