import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../function/ThemeContext";

export default function Settings() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  const { toggleTheme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex justify-between">
        <button
          onClick={logout}
          className="rounded-md border-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
        >
          {" "}
          Logout{" "}
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-md border-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
        >
          Dark Mode (Soon)
        </button>
      </div>
    </>
  );
}
