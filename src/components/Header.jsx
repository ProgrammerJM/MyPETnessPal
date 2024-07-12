import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-violetBG shadow-lg w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
      <div className="flex items-center h-16">
        <img
          src="/images/petness-logo-icon.png"
          alt="Petness"
          className="h-16 w-auto pl-4 md:pl-10"
        />

        <div className="flex items-center gap-6 md:gap-10 ml-auto">
          <Link
            to="/"
            className="text-lg font-medium px-4 py-2 text-light-darkViolet hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
          >
            Home
          </Link>
          <ScrollLink
            to="about-section"
            smooth={true}
            duration={500}
            className="cursor-pointer text-lg font-medium px-4 py-2 text-gray-600 hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="contact-section"
            smooth={true}
            duration={500}
            className="cursor-pointer text-lg font-medium px-4 py-2 text-gray-600 hover:text-indigo-900 hover:shadow-md transition duration-150 ease-in-out"
          >
            Contact Us
          </ScrollLink>
        </div>
      </div>
    </header>
  );
}
