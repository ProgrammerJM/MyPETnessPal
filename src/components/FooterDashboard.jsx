import petnessLogo from "../assets/images/petness-logo.png";

export default function FooterDashboard() {
  return (
    <>
      <footer className="footer bg-gray-700 p-6 flex justify-center items-center text-center">
        <div className="border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-3 w-full max-w-3xl">
          <div className="flex justify-center items-center">
            <img
              src={petnessLogo}
              className="h-12 sm:h-20 mx-auto"
              alt="PETness"
            />
          </div>
          <div className="text-sm text-white mb-2">
            © 2023-2024 PETNESS™. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
