import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <div className="bg-homeBG bg-no-repeat bg-cover">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-20">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Because your Pal deserves the best, PETnessPAL
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              This free and open-source landing page template was built using
              the utility classes from
              <a href="." className="hover:underline">
                Tailwind CSS
              </a>
              and based on the components from the
              <a href="." className="hover:underline">
                Flowbite Library
              </a>
              and the
              <a href="." className="hover:underline">
                Blocks System
              </a>
              .
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Signup
              </Link>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="/images/petness-logo-icon.png"
              alt="hero image"
              className="h-30 object-contain width-auto"
            ></img>
          </div>
        </div>

        <h1 className="text-5xl flex justify-center p-10">
          Learn About US: <span className="font-bold">Anytime PETness</span>
        </h1>
        <div className="flex justify-center">
          <img
            src="/images/aboutus.png"
            className="w-auto h-auto max-w-[50%] max-h-[75%]"
          />
          <div className="flex flex-col w-96 mt-5 overflow-y-auto max-h-[calc(100vh-200px)] max-w-[50%]">
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
              consectetur elit, quis pulvina.
            </p>
            <br />
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
              consectetur elit, quis pulvina.
            </p>
            <br />
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
              consectetur elit, quis pulvina.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
