import { Outlet } from "react-router-dom";
import Dashboard from "./ProfileNavigation";
import FooterDashboard from "./FooterDashboard";
// import HeaderDashboard from "./HeaderDashboard";

export default function PetsLayout() {
  // return (
  //   <div className="flex h-screen overflow-active ">
  //     <Dashboard />
  //     <div className="flex-1 flex flex-col">
  //       {/* <HeaderDashboard /> */}
  //       <main className="flex-1 overflow-y-auto bg-light-backdrop">
  //         <div className="container max-w-full mx-auto p-8">
  //           <div className="Outlet">
  //             <Outlet />
  //           </div>
  //         </div>
  //         <div className="Footer">
  //           <FooterDashboard />
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex h-screen overflow-hidden">
      <Dashboard />
      <div className="flex-1 flex flex-col">
        {/* <HeaderDashboard /> */}
        <main className="flex-1 overflow-y-auto bg-light-backdrop">
          <div className="container mx-auto px-2 pt-0 pb-4 lg:p-8 max-[440px]:mt-10 max-[360px]:mt-10 sm:mt-10 md:mt-10 lg:mt-0">
            <div className="Outlet">
              <Outlet />
            </div>
          </div>
          <div className="Footer mt-auto">
            <FooterDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
