import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";

type Props = { children: React.ReactNode; requireAdmin?: boolean };

// Wrap routes that need auth. Wait for `loading` (session hydration) before redirecting,
// otherwise a logged-in user would be bounced to /login on a hard refresh.
const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
