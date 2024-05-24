export default function FooterDashboard() {
  return (
    <>
      <footer className="footer bg-gray-700	 flex text-center">
        <div className="border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-3">
          <a
            href="#"
            className="flex items-center justify-center m-3 text-xl font-semibold text-whiteViolet"
          >
            Anytime PETness
          </a>
          <img
            src="../src/assets/petness-logo-icon.png"
            className="h-6 mr-3 sm:h-9"
            alt="PETness"
          />
          <div className="text-sm text-center text-white m-2">
            © 2023-2324 PETNESS™. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
