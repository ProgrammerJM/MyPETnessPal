import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="header bg-violetBG backdrop-blur-sm shadow-lg w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
        <div className="nav-content flex items-center md:h-16">
          <img
            src="/images/petness-logo-icon.png"
            alt="Petness"
            className="logo pl-10"
          />

          <div className="nav-content-text flex-row items-center h-10 md:h-16 flex gap-10 m-auto">
            <Link
              to="/"
              className="font-medium text-lg px-8 py-4 size-full w-fit text-gray-600 hover:text-indigo-900 hover:shadow-md flex items-center transition duration-150 ease-in-out"
            >
              Home
            </Link>
            <NavLink
              to="/about"
              className="font-medium text-lg px-8 py-4 size-full w-fit text-gray-600 hover:text-indigo-900 hover:shadow-md flex items-center transition duration-150 ease-in-out"
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className="font-medium text-lg px-8 py-4 size-full w-fit text-gray-600 hover:text-indigo-900 hover:shadow-md flex items-center transition duration-150 ease-in-out"
            >
              Contact Us
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}
