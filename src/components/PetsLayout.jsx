import { NavLink, Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function PetsLayout() {
  const activestyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#161616",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex">
        <nav className="flex flex-col bg-gray-200 py-4 px-2 w-48">
          <NavLink
            to="."
            end
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="petprofile"
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Pet Profile
          </NavLink>

          <NavLink
            to="notifications"
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Notifications
          </NavLink>

          <NavLink
            to="tank"
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Tank Management
          </NavLink>

          <NavLink
            to="help"
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Help Guidelines
          </NavLink>

          <NavLink
            to="settings"
            className="text-gray-800 hover:text-gray-600"
            activestyle={activestyle}
          >
            Settings
          </NavLink>
        </nav>
        <div className="flex-grow bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
