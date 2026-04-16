import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoutes = ({ children }: { children?: React.ReactNode }) => {
  const user = useSelector((state: any) => state.auth.user);
  const location = useLocation();

  // ⏳ still loading
  if (user === undefined) return null;

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not verified
  if (!user.isEmailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  // ❌ Not onboarded
  if (!user.isProfileComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // ✅ Already onboarded → block onboarding page
  if (user.isProfileComplete && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children ? children : <Outlet />;
};
