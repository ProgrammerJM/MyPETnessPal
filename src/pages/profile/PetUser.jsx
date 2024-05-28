import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import FeedAmountComponent from "./feedAmountComponent";

export default function PetUser({ petList, petFoodList }) {
  const { petId } = useParams();

  // Get the petList data from localStorage if petList prop is empty
  const persistedPetList = petList.length
    ? petList
    : JSON.parse(localStorage.getItem("petList"));

  // Find the pet data for the current petId
  const petData = persistedPetList.find((pet) => pet.id === petId);

  //   const petName = petData ? petData.name : "Unknown";
  const petName = petData ? petData.name : "Unknown";

  const { name, id, weight, activityLevel, petType } = petData;

  console.log(petName);

  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Welcome Banner */}
          <div className="relative bg-profileBG bg-no-repeat p-4 sm:p-6 rounded-t-xl overflow-hidden mb-4 shadow-md bg-cover">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
                Pet Profile: {petName} 👋
              </h1>
              <p className="dark:text-indigo-200">Hi its me, {petId}!</p>
            </div>
          </div>

          <div className=" grid grid-cols-12 md:mt-6 md:gap-4 2xl:mt-7.5 2xl:gap-7.5 w-full">
            {/* PET PROFILE DEETS */}
            <div className="flex items-center col-span-12 border border-stroke bg-white p-10 shadow-default dark:border-strokedark sm:px-7.5 xl:col-span-7 rounded-xl shadow-md">
              <div className="flex items-center ml-10 ">
                <div className="rounded-full bg-darkViolet/80 backdrop-blur p-1">
                  <div className="rounded-full bg-white p-1 overflow-hidden size-48">
                    {/* Insert Here Selected Pet Profile Picture */}
                    <img
                      src="../../src/assets/bgViolet.jpg"
                      alt="Pet User Image : Selected Pet Profile Picture"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left ml-10">
                <h2 className="text-2xl my-4 font-semibold text-gray-900">
                  MINGMING
                </h2>

                <p className="text-lg text-gray-600">
                  {/* PET'S TYPE */}
                  <span className="font-semibold">Pet Type:</span> Cat
                </p>
                <p className="text-lg text-gray-600">
                  {/* PET'S CURRENT WEIGHT */}
                  <span className="font-semibold">Current Weight:</span> 8lbs
                </p>
                <p className="text-lg text-gray-600">
                  {/* PET'S AGE */}
                  <span className="font-semibold">Age:</span> 16 Months
                </p>
                <p className="text-lg text-gray-600">
                  {/* PET'S ACTIVITY LEVEL */}
                  <span className="font-semibold">Activity Level:</span>{" "}
                  Neutered Adult
                </p>
                <p className="text-lg text-gray-600">
                  {/* FOOD SELECTED */}
                  <span className="font-semibold">Food Selected:</span> Food
                  Selected
                </p>
              </div>
            </div>

            {/* <!-- FEEDING MODE SELECTION --> */}
            <div className="col-span-12 border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Feeding Mode
              </h2>

              <div className="flex items-center mb-4">
                <button className="flex-1 py-2 px-4 bg-gray-200 rounded-l-full text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-darkViolet">
                  Smart Feeding
                </button>
                <button className="flex-1 py-2 px-4 bg-darkViolet text-white rounded-r-full font-semibold focus:outline-none focus:ring-2 focus:ring-darkViolet">
                  Scheduled Feeding
                </button>
          <div className="grid grid-cols-3 gap-2 bg-white rounded-b-xl h-screen">
            <div className="mt-4 grid grid-cols-12 md:mt-6 md:gap-4 2xl:mt-7.5 2xl:gap-7.5">
              <div className="col-span-12 border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark sm:px-7.5 xl:col-span-8 rounded-xl shadow-md">
                {/* PET PROFILE */}
                PET PROFILE
                <p>Id {petData.id}</p>
                <p>Weight {petData.weight}</p>
                <p>Activity Level {petData.activityLevel}</p>
              </div>
              <div
                className="col-span-12 border border-stroke bg-white p-7.5 shadow-default
        dark:border-strokedark dark:bg-boxdark xl:col-span-4 rounded-xl shadow-md"
              >
                {/* FEEDING MODE SELECTION */}
                FEEDING MODE SELECTION
                <div className="flex item-center justify-center">
                  <FeedAmountComponent
                    petId={id}
                    petName={name}
                    petType={petType}
                    weight={Number(weight)}
                    activityLevel={Number(activityLevel)}
                    petFoodList={petFoodList}
                  />
                </div>

              <p className="text text-gray-600">
                Descriptive Analytics Enter Here Descriptive Analytics Enter
                HereDescriptive Analytics Enter HereDescriptive
              </p>
              <p className="text text-gray-600 mt-2">
                <span className="font-semibold">
                  Maintenance Energy Requirement (MER):
                </span>
                <a href="#" className="text-darkViolet underline">
                  {/* Maintenance Energy Requirement*/}
                  1556.70 kilocalories/day
                </a>
              </p>
              <p className="text text-gray-600 mt-2">
                <span className="font-semibold">Calculated Food Needed:</span>{" "}
                {/* Amount To Dispensed Per Day*/}
                242.44 g per meal / 484.88 g per day
              </p>
            </div>

            {/* <!-- DATA ANALYTICS SECTION --> */}
            <div className="col-span-12 border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Mingming Weight Trend
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="border border-stroke bg-white p-5 shadow-default dark:border-strokedark rounded-lg shadow-sm xl:col-span-1 flex justify-center items-center">
                  <p className="text-center">GRAPH HERE</p>
                </div>
                <div className="border border-stroke bg-white p-5 shadow-default dark:border-strokedark rounded-lg shadow-sm xl:col-span-2 overflow-auto">
                  <p className="text-center">TABLE HERE</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

PetUser.propTypes = {
  petList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      activityLevel: PropTypes.number.isRequired,
      petType: PropTypes.string.isRequired,
      // include other pet properties here
    })
  ).isRequired,
  petFoodList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      //   brand: PropTypes.string.isRequired,
      //   type: PropTypes.string.isRequired,
      //   kcalPerCup: PropTypes.number.isRequired,
      //   cupsPerDay: PropTypes.number.isRequired,
      //   weight: PropTypes.number.isRequired,
    })
  ).isRequired,
};
