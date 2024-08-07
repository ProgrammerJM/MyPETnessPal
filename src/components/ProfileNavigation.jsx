import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { BiLeftArrowAlt, BiMenu } from "react-icons/bi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlinePets } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { GiChemicalTank } from "react-icons/gi";
import { MdHelp } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { GiBirdCage } from "react-icons/gi";
import { NotificationContext } from "../pages/function/NotificationsContext";
import petnessLogoName from "../assets/images/petness-logo-name.png";
import petnessLogoIcon from "../assets/images/petness-logo-icon.png";

const navBarIcon_Close =
  "text-light-mainColor size-9 cursor-pointer ml-2 transition duration-300 ease-in-out";
const navBarText =
  "text-black text-m font-semibold w-full items-center px-2 py-2 transition duration-300 ease-in-out";
const navBar_Open =
  "inline-flex items-center shadow-md mt-2 p-2 w-full transition duration-300 ease-in-out";

export default function ProfileNavigation() {
  const [open, setOpen] = useState(true); // Start with the sidebar closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useContext(NotificationContext);

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="lg:flex bg-light-whiteViolet">
        {!isMobileMenuOpen && (
          <div
            className="lg:hidden fixed top-2 z-50 text-light-darkViolet"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <BiMenu className="text-3xl" />
          </div>
        )}

        {/* Sidebar - Desktop and Tablet View */}
        <div
          className={`h-screen text-black pt-3 overflow-visible transition duration-300 ease-in-out relative ${
            open ? "w-64" : "w-20"
          } hidden lg:block`}
        >
          <BiLeftArrowAlt
            className={`bg-white mt-16 text-subColor rounded-full text-2xl absolute -right-3 top-12 cursor-pointer duration-500 shadow-md ${
              !open && "rotate-180 mt-12"
            }`}
            onClick={() => setOpen(!open)}
          />

          {/* Navbar Header */}
          <div className="inline-flex items-center justify-center border-b-2 border-subColor-500 shadow-s p-5">
            <img
              src={petnessLogoIcon}
              alt="Petness"
              className={`w-16 h-16 duration-500 ease-in-out ${
                open && "rotate-[360deg]"
              }`}
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="duration-300">
                <img src={petnessLogoName} className="ml-2 w-36" />
              </div>
            )}
          </div>

          {/* Navbar Content */}
          <div className="flex flex-col content-center mt-7">
            {[
              { to: ".", label: "Dashboard", icon: TbLayoutDashboardFilled },
              { to: "petprofile", label: "Pet Profile", icon: MdOutlinePets },
              { to: "cage", label: "Cage Management", icon: GiBirdCage },
              { to: "tank", label: "Tank Management", icon: GiChemicalTank },
              {
                to: "notifications",
                label: "Notifications",
                icon: IoNotifications,
              },
              { to: "help", label: "Guidelines", icon: MdHelp },
              { to: "settings", label: "Settings", icon: IoMdSettings },
            ].map(({ to, label, icon: Icon }) => (
              <div
                key={to}
                className={`${navBar_Open} ${
                  !open
                    ? "px-2.5 border border-zinc-100 rounded-2xl mt-0"
                    : "px-4 shadow-none"
                }`}
              >
                <NavLink
                  className={({ isActive }) =>
                    `${navBarIcon_Close} ${
                      isActive ? "font-bold underline text-black" : ""
                    }`
                  }
                  to={to}
                  end
                >
                  <Icon className="mr-2 text-3xl" />
                  {to === "notifications" && unreadCount > 0 && (
                    <span className="ml-1 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center relative left-4 bottom-1">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>

                {open && (
                  <NavLink
                    className={({ isActive }) =>
                      `${navBarText} ${
                        isActive ? "font-bold underline text-black" : ""
                      }`
                    }
                    to={to}
                    end
                  >
                    {label}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-light-whiteViolet transform transition-transform duration-200 ease-in-out z-40 lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b-2 border-subColor-500 shadow-s">
            <img src={petnessLogoIcon} alt="Petness" className="w-16 h-16" />
            <BiLeftArrowAlt
              className="text-2xl cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
          <div className="flex flex-col content-center mt-7">
            {[
              { to: ".", label: "Dashboard", icon: TbLayoutDashboardFilled },
              { to: "petprofile", label: "Pet Profile", icon: MdOutlinePets },
              { to: "cage", label: "Cage Management", icon: GiBirdCage },
              {
                to: "notifications",
                label: "Notifications",
                icon: IoNotifications,
              },
              { to: "tank", label: "Tank Management", icon: GiChemicalTank },
              { to: "help", label: "Guidelines", icon: MdHelp },
              { to: "settings", label: "Settings", icon: IoMdSettings },
            ].map(({ to, label, icon: Icon }) => (
              <div
                key={to}
                className={`${navBar_Open}`}
                onClick={handleNavLinkClick}
              >
                <NavLink
                  className={({ isActive }) =>
                    `${navBarIcon_Close} ${
                      isActive ? "font-bold underline text-black" : ""
                    }`
                  }
                  to={to}
                  end
                >
                  <Icon className="mr-2 text-3xl" />
                  {to === "notifications" && unreadCount > 0 && (
                    <span className="ml-1 text-xs bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `${navBarText} ${
                      isActive ? "font-bold underline text-black" : ""
                    }`
                  }
                  to={to}
                  end
                >
                  {label}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
