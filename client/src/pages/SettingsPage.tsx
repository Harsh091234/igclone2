import { useEffect, useState } from "react";
import SettingsMenu from "../components/SettingsMenu";
import { Outlet, useLocation } from "react-router-dom";

const SettingsPage = () => {
  const location = useLocation();
  const isRoot =
    location.pathname === "/settings" || location.pathname === "/settings/";
  useEffect(() => console.log("is root:", isRoot), []);
  const [isClicked, setIsClicked] = useState(false);
  console.log(isClicked);
  return (
    <div className="grid h-[100dvh] w-full sm:grid-cols-[300px_1fr]">
      {/* LEFT PANEL */}
      <div
        className={`md:border-r md:border-border
      ${isRoot ? "block" : "hidden"} 
      sm:block
    `}
      >
        <SettingsMenu onClose={() => setIsClicked(true)} />
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`
      ${isRoot ? "hidden" : "block"} 
      sm:block overflow-y-auto
    `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
