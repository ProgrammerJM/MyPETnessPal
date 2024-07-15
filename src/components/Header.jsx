import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import violetBG from "../assets/images/bgViolet.jpg";
import petnessLogoIcon from "../assets/images/petness-logo-icon.png";

export default function Header() {
  const location = useLocation();

  // Check if we are on the Home route
  const isHomeRoute = location.pathname === "/";

  return (
    <header
      style={{ backgroundImage: `url(${violetBG})` }}
      className="shadow-lg w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-10">
        <img src={petnessLogoIcon} alt="Petness" className="h-16 w-auto" />

        <div className="flex items-center gap-6 md:gap-10">
          <Link
            to="/"
            className="text-lg font-medium py-2 text-light-darkViolet hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
          >
            Home
          </Link>
          {isHomeRoute && (
            <ScrollLink
              to="about-section"
              smooth={true}
              duration={500}
              className="md:text-center sm:text-center cursor-pointer text-lg font-medium px-4 py-2 text-gray-600 hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
            >
              About Us
            </ScrollLink>
          )}
          {isHomeRoute && (
            <ScrollLink
              to="contact-section"
              smooth={true}
              duration={500}
              className="cursor-pointer text-lg font-medium px-4 py-2 text-gray-600 hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
            >
              Contact Us
            </ScrollLink>
          )}
        </div>
      </div>
    </header>
  );
}
