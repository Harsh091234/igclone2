
import { Navigate } from "react-router-dom";

const SettingsIndexRedirect = () => {
  const isDesktop = window.matchMedia("(min-width: 640px)").matches;

  // above sm → auto open edit profile
  if (isDesktop) {
    return <Navigate to="edit-profile" replace />;
  }

  // below sm → stay on menu
  return null;
};

export default SettingsIndexRedirect;
