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
