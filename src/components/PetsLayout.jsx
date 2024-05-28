import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import FooterDashboard from "./FooterDashboard";
import HeaderDashboard from "./HeaderDashboard";

export default function PetsLayout() {
  return (
    <div className="flex h-screen overflow-active ">
      <Dashboard />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard />
        <main className="flex-1 overflow-y-auto bg-backdrop">
          <div className="container max-w-full mx-auto p-8">
            <div className="Outlet">
              <Outlet />
            </div>
          </div>
          <div className="Footer">
            <FooterDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
