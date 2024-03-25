import { Link } from 'react-router-dom';
export default function Home() {
  // flex flex-row flex-wrap h-dvh justify-center self-center py-20
  return (
    <>
      <div className="grid grid-cols-2 grid-rows-1 h-dvh place-0 mx-10">
        <div className="md:basis-auto justify-center will-change-auto">
          <img
            src="../src/assets/petness-logo-name.png"
            className="w-100 mt-10"
          />
          <p className="text-justify text-wrap w-100 text-2xl justify-center mr-10 ml-10 mb-10">
            Body standard phasellus justo purus, venenatis a sapien eu, faucibus
            porttitor libero. Proin venenatis diam tortor, nec vulputate sem
            efficitur in. Aenean ipsum ipsum, imperdiet non tristique id, auctor
            vitae nibh.
          </p>
          <div className="flex m-10 justify-center items-center">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 ml-0">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
              Signup
            </Link>
          </div>
        </div>
        <div className="md:basis-auto will-change-auto flex justify-center place-items-center mb-20">
          <img src="../src/assets/petness-frame.png" />
        </div>
      </div>
    </>
  );
}
