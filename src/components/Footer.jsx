import petnessLogo from "../assets/images/petness-logo.png";

export default function Footer() {
  return (
    <footer className="footer bg-gray-700	p-6 pt-10 flex text-center">
      <div className="border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-3">
        <div className="flex flex-row-reverse justify-center items-center">
          <img src={petnessLogo} className="h-12 mr-3 sm:h-20" alt="PETness" />
        </div>
        <div className="text-sm text-center text-white mb-2">
          © 2023-2324 PETNESS™. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
