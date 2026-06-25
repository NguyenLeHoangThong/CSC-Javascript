import { Alert, Box, Button, Container, Link as MuiLink, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after a successful login (set by ProtectedRoute), defaults to home.
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("customer@cscshop.com");
  const [password, setPassword] = useState("Customer@123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Sign in
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Demo account is pre-filled — just press Sign in.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </Box>

        <Typography sx={{ mt: 3 }} textAlign="center">
          No account?{" "}
          <MuiLink component={Link} to="/register">
            Create one
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
