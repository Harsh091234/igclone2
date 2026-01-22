import { useEffect, useState } from "react";
import SettingsMenu from "../components/SettingsMenu";
import { Outlet, useLocation } from "react-router-dom";

const SettingsPage = () => {
  const location = useLocation();
   const isRoot = location.pathname === "/settings" || location.pathname === "/settings/";
  useEffect(() => console.log("is root:", isRoot), []);
  const [isClicked, setIsClicked] = useState(false);
  console.log(isClicked)
  return (
    <div className="flex w-full h-full">
     
        <div
          className={`
          w-full sm:w-[30%]  sm:block
          ${isRoot ? "block" : "hidden"}
        `}
        >
          <SettingsMenu onClose={() => setIsClicked(true)} />
        </div>
   

      <div
        className={`
          w-full sm:w-[70%]
          ${isRoot ? "hidden sm:block" : "block"}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
