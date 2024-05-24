import { NavLink } from "react-router-dom";
import { useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlinePets } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { GiChemicalTank } from "react-icons/gi";
import { MdHelp } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoMdAnalytics } from "react-icons/io";

const navBarIcon_Close =
  "text-mainColor size-9 block content-center cursor-pointer ml-2 transition duration-300 ease-in-out";
const navBarText =
  "text-black text-m font-semibold content-center w-full items-center px-2 py-2 transition duration-300 ease-in-out";
const navBar_Open =
  "inline-flex items-center shadow-md mt-2 p-2 w-full transition duration-300 ease-in-out ";

export default function Dashboard() {
  const activestyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#161616",
  };

  const [open, setOpen] = useState(true);

  return (
    <>
      <div className="flex bg-whiteViolet">
        <div
          className={`h-screen text-black pt-3 overflow-visible
        ${open ? "w-64" : "w-20"}
        transition duration-300 ease-in-out relative `}
        >
          <BiLeftArrowAlt
            className={`bg-white mt-16 text-subColor rounded-full text-2xl absolute -right-3 top-12 cursor-pointer duration-500 shadow-md 
         ${!open && "rotate-180 mt-12"}`}
            onClick={() => setOpen(!open)}
          />

          {/*Navbar Header */}
          <div className="inline-flex border-b-2 border-subColor-500 shadow-s  p-5 ">
            <img
              src="../src/assets/petness-logo-icon.png"
              alt="Petness"
              className={
                'logo float-left w-10 h-10 mt-4 duration-500 ease-in-out ${open && "ml-2 rotate-[360deg]"} '
              }
              onClick={() => setOpen(!open)}
            />

            <div
              className={`duration-300
           ${!open && "scale-0"}`}
            >
              <img
                src="../src/assets/petness-logo-name.png"
                className="w-75 mt-75 ml-3"
              />
            </div>
          </div>

          {/*Navbar Content*/}
          <div className="flex flex-col content-center mt-7">
            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <TbLayoutDashboardFilled
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="."
                end
                activestyle={activestyle}
              >
                Dashboard
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <MdOutlinePets
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="petprofile"
                end
                activestyle={activestyle}
              >
                Pet Profile
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <IoMdAnalytics
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="."
                end
                activestyle={activestyle}
              >
                Analytics
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <IoNotifications
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="notifications"
                end
                activestyle={activestyle}
              >
                Notifications
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <GiChemicalTank
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="tank"
                end
                activestyle={activestyle}
              >
                Tank Management
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <MdHelp
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="help"
                end
                activestyle={activestyle}
              >
                Guidelines
              </NavLink>
            </div>

            <div
              className={`${navBar_Open} 
            ${
              !open
                ? "px-2.5 content-center border border-zinc-100 rounded-2xl mt-0"
                : "px-4 shadow-none"
            }`}
            >
              <IoMdSettings
                className={`${navBarIcon_Close}, ${open && "mr-2"}`}
                onClick={() => setOpen(!open)}
              />

              <NavLink
                className={`${navBarText}, ${!open && "hidden"}`}
                to="settings"
                end
                activestyle={activestyle}
              >
                Settings
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
