import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import FooterDashboard from "./FooterDashboard";
import HeaderDashboard from "./HeaderDashboard";

export default function PetsLayout() {

  return (
    <div className ="flex h-screen overflow-active ">
    <Dashboard/>
    <div className="Header flex-1 flex flex-col">
      <HeaderDashboard/>
        <main className="flex-1 overflow-y-auto bg-backdrop">
          <div className="container max-w-full mx-auto px-6 py-6">
            <div className="Outlet bg-white rounded-2xl p-4">
            <Outlet/>
            </div>
          </div>
          <div className="Footer">
          <FooterDashboard/>
          </div>
        </main>        
    </div>
  </div>
  );
  
}
