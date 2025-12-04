import React from "react";
import SettingsMenu from "../components/SettingsMenu";
import { Outlet } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen gap-10 ">
      <div className="w-[30%]">
        <SettingsMenu />
      </div>
      <div className="w-[70%]">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
