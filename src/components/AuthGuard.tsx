import React from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthDisabled =
    import.meta.env.VITE_DISABLE_AUTH == true ||
    import.meta.env.VITE_DISABLE_AUTH == "true";

  const isAuthenticated = isAuthDisabled || !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
