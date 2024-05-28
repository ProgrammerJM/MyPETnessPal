export default function SinglePetProfile() {
  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Welcome Banner */}
          <div className="relative bg-profileBG bg-no-repeat p-4 sm:p-6 rounded-t-xl overflow-hidden mb-4 shadow-md bg-cover">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
                Muning Profile 👋
              </h1>
              <p className="dark:text-indigo-200">Hi its me, Muning!</p>
            </div>{" "}
          </div>
          <div className="grid grid-cols-3 gap-2 bg-white rounded-b-xl h-screen">
            <div className="mt-4 grid grid-cols-12 md:mt-6 md:gap-4 2xl:mt-7.5 2xl:gap-7.5">
              <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark sm:px-7.5 xl:col-span-8 rounded-xl shadow-md">
                {/* PET PROFILE */}
                PET PROFILE
              </div>

              <div
                className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default 
        dark:border-strokedark dark:bg-boxdark xl:col-span-4 rounded-xl shadow-md"
              >
                {/* FEEDING MODE SELECTION */}
                FEEDING MODE SELECTION
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
