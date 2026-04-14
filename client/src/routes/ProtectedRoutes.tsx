import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoutes = ({ children }: { children?: React.ReactNode }) => {
  const user = useSelector((state: any) => state.auth.user);
  const location = useLocation();
const isVerifyEmailPage = location.pathname.startsWith("/verify-email");
  const isVerificationRoute =
    location.pathname.startsWith("/check-email") ||
    location.pathname.startsWith("/resend-verification-url");

  // ⏳ still loading user
  if (user === undefined) return null;

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not verified → allow ONLY verification pages
  if (!user.isEmailVerified) {
    if (isVerifyEmailPage || isVerificationRoute ) {
      return children ? children : <Outlet />;
    }
    return <Navigate to="/check-email" replace />;
  }

  // ✅ Already verified → block verification pages
  if (user.isEmailVerified && isVerificationRoute && !isVerifyEmailPage) {
    return <Navigate to="/" replace />;
  }

  // ❌ Not onboarded
  if (!user.isProfileComplete) {
    if (location.pathname !== "/onboarding"  &&  !isVerifyEmailPage) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // ✅ Already onboarded → block onboarding page
  if (user.isProfileComplete && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children ? children : <Outlet />;
};