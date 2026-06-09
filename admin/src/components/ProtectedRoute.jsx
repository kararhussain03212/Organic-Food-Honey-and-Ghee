import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && String(user.status || "active").toLowerCase() === "inactive") {
    logout();
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, deactivated: true }}
      />
    );
  }

  return children;
}
