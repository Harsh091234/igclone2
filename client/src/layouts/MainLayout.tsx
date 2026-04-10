import { Outlet } from "react-router-dom";
import LeftSideBar from "../components/LeftSideBar";

const MainLayout = () => {
  return (
    <div className="bg-green-500 min-h-screen grid grid-cols-1 lg:grid-cols-[60px_1fr] xl:grid-cols-[75px_1fr]">
      <LeftSideBar />
      <main className="overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;