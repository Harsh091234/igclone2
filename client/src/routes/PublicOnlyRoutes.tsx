import { Navigate, Outlet} from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicOnlyRoute = ({ children }: { children?: React.ReactNode }) => {
  const user = useSelector((state: any) => state.auth.user);

  // ⏳ loading
  if (user === undefined) return null;

  // ✅ Not logged in → allow
  if (!user) return children ?? <Outlet />;

  // ❌ Logged in → block
  return <Navigate to="/" replace />;
};
