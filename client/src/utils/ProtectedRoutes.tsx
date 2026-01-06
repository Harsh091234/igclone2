import { Navigate, useLocation } from "react-router-dom";
import CenterLoading from "../components/CenterLoading";
import { useUser } from "@clerk/clerk-react";
import { useGetAuthUserQuery } from "../services/userApi";
import type { ReactNode } from "react";
interface ProtectedRoutesProps {
  children: ReactNode;
}
export const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

 
  const { data, isLoading } = useGetAuthUserQuery(undefined, {
    skip: !isLoaded || !isSignedIn,
  });


  const authUser = data?.user;
const isProfileComplete = authUser?.isProfileComplete;

if (!isLoaded || isLoading) return <CenterLoading />;

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!authUser) {
    // backend user still syncing
    return <CenterLoading />;
  }

  if (!isProfileComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isProfileComplete && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
