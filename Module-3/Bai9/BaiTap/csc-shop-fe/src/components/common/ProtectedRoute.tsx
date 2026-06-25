import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

import { useAuth } from "../../context/AuthProvider";

// Wrap any route that requires login. If the user is not authenticated,
// redirect to /login and remember where they were trying to go.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While we are still checking the saved token, show a spinner instead of flashing the login page.
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
