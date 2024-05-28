import { IoAddCircle } from "react-icons/io5";

export default function Dashboard() {
  return (
    <>
      <div className="flex gap-5">
        {/* BUTTON  */}
        <div className="flex flex-col gap-2 place-items-center m-5 p-5 border-2 border-black">
          Button with Icon
          <button
            className="text-white inline-flex items-center justify-center gap-2.5 rounded-md bg-darkViolet py-3 px-7 
        text-center font-medium hover:bg-opacity-90 mb-4"
          >
            <IoAddCircle className="size-7" />
            Add Pet
          </button>
        </div>

        {/* BODY  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-2xl p-4"></div>
      </div>
    </>
  );
}
