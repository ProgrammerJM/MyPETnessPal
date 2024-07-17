import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import petnessLogoSquare from "../assets/images/petness-logo-square.png";
import homeBG from "../assets/images/bg-petness.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (loginError) {
      timer = setTimeout(() => {
        setLoginError("");
      }, 5000); // Clear error after 5 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [loginError]); // Effect runs when loginError changes

  // Clear fields when component unmounts or navigates away
  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setLoginError("");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setLoginError("Failed to login. Please check your email and password.");
    }
  };

  return (
    <main
      className="bg-no-repeat bg-cover min-h-screen flex flex-col overflow-auto justify-center items-center bg-white p-4"
      style={{ backgroundImage: `url(${homeBG})` }}
    >
      <section className="flex flex-col md:flex-row justify-center items-center w-full max-w-4xl bg-gray-50 rounded-lg shadow-md overflow-hidden">
        <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
          <img
            className="object-contain h-40 md:h-96"
            src={petnessLogoSquare}
            alt="Petness"
          />
        </div>
        <article className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl mb-6 font-bold leading-9 tracking-tight text-light-darkViolet text-center">
            Sign in to your account
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-left text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-light-darkViolet "
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md text-white shadow-sm bg-light-mainColor hover:bg-light-darkViolet px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Don{"'"}t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up here
              </Link>
            </p>
            {loginError && (
              <p className="text-red-500 text-center">{loginError}</p>
            )}
          </form>
        </article>
      </section>
    </main>
  );
}
