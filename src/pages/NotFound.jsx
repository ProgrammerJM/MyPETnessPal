import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <p className="mt-5 flex justify-center text-4xl text-red-500">
        Error 404: Page not found.
      </p>
      <br />
      <Link to="/" className="flex justify-center">
        <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go back to Home
        </button>
      </Link>
    </>
  );
}
