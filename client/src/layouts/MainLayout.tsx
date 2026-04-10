import { Outlet } from "react-router-dom";
import LeftSideBar from "../components/LeftSideBar";

const MainLayout = () => {
  return (
    <div className="bg-green-500 h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[60px_1fr] xl:grid-cols-[75px_1fr]">
      <LeftSideBar />
      <main className="overflow-hidden h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;