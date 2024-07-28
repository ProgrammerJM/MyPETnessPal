import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import petnessLogoSquare from "../assets/images/petness-logo-square.png";
import homeBG from "../assets/images/bg-petness.png";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    let regExOfEmail = /\S+@\S+\.\S+/;
    return regExOfEmail.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox.");
      setIsVerificationSent(true);

      // Clear input fields after signup
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  useEffect(() => {
    let interval;
    if (isVerificationSent) {
      interval = setInterval(async () => {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(interval);
            setMessage("Email verified successfully! Redirecting to login...");
            // Sign out the user so they can log in again
            await signOut(auth);
            setTimeout(() => {
              navigate("/login");
            }, 2000); // Redirect after 2 seconds
          }
        }
      }, 2000); // Check every 2 seconds
    }

    return () => clearInterval(interval);
  }, [isVerificationSent, navigate]);

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
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-light-darkViolet">
              Create an account
            </h2>
          </div>

          <form onSubmit={handleSignup} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mt-4 text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button className="flex w-full justify-center rounded-md bg-light-mainColor text-white shadow-sm hover:bg-light-darkViolet px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign up
              </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-light-mainColor hover:text-light-darkViolet"
            >
              Sign in here
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
