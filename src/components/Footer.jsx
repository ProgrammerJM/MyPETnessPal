import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="footer bg-neutral-800 flex text-center">
        <div className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8">
          <a
            href="#"
            className="flex items-center justify-center mb-5 text-2xl font-semibold text-indigo-300"
          >
            <img
              src="../src/assets/petness-logo-icon.png"
              className="h-6 mr-3 sm:h-9"
              alt="PETness"
            />
            Anytime PETness
          </a>
          <span className="block text-sm text-center text-gray-300">
            © 2023-2324 PETNESS™. All Rights Reserved.
          </span>

          <ul className="flex justify-center mt-5 space-x-5">
            <li>
              <a href="#" className="text-gray-400 hover:text-indigo-200 ">
                <Link
                  to="https://www.facebook.com/johnmarkt00"
                  target="_blank"
                  className="m-1 ml-5 w-fit"
                >
                  Facebook{" "}
                </Link>
              </a>
            </li>

            <li>
              <a href="#" className="text-gray-400 hover:text-indigo-200 ">
                <Link
                  to="https://www.instagram.com/jmjtiz"
                  target="_blank"
                  className="m-1 ml-5 w-fit"
                >
                  Instagram{" "}
                </Link>
              </a>
            </li>

            <li>
              <a href="#" className="text-gray-400 hover:text-indigo-200 ">
                <Link
                  to="https://www.linkedin.com/johnmarktizado"
                  target="_blank"
                  className="m-1 ml-5 w-fit"
                >
                  Instagram{" "}
                </Link>
              </a>
            </li>

            <li>
              <a href="#" className="text-gray-400 hover:text-indigo-200 ">
                <Link
                  to="https://www.twitter.com/jmjtiz"
                  target="_blank"
                  className="m-1 ml-5 w-fit"
                >
                  Twitter{" "}
                </Link>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
