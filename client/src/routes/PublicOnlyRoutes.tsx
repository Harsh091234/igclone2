import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: any) => state.auth.user);

  if (!user) return children;

  if (!user.isEmailVerified) return <Navigate to="/check-email" />;
  if (!user.isProfileComplete) return <Navigate to="/onboarding" />;

  return <Navigate to="/" />;
};