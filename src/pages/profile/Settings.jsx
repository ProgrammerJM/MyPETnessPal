import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../function/ThemeContext";

export default function Settings() {
  const navigate = useNavigate();
  const { toggleTheme, isDarkMode } = useContext(ThemeContext); // Assuming isDarkMode indicates current theme mode

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-light-darkViolet">
        Settings
      </h1>
      {/* Account Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-light-darkViolet">
          Account Settings
        </h2>
        <button
          onClick={handleLogout}
          className="w-fit h-full py-2 px-4 bg-light-darkViolet text-white rounded-md shadow-sm hover:bg-light-mainColor"
          aria-label="Logout of your account"
        >
          Logout
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Log out from your account and return to the login screen.
        </p>
      </div>
      {/* Preferences */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-light-darkViolet">
          Preferences (Soon To Implement)
        </h2>
        <div className="flex flex-col justify-between mb-4">
          <button
            onClick={toggleTheme}
            className="w-fit h-full py-2 px-4 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Toggle between dark and light mode for your visual preference.
          </p>
        </div>
      </div>
    </div>
  );
}
