import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { TiDelete } from "react-icons/ti";
import { LuView } from "react-icons/lu";
import FeedAmountComponent from "./feedAmountComponent";

const PetList = ({
  petList,
  deletePet,
  smartFeedingActivated,
  petFoodList,
}) => {
  const navigate = useNavigate();
  const activityLevelOptions = {
    Cat: [
      { value: 1.4, label: "Intact (Multiply RER by 1.4)" },
      { value: 1.2, label: "Neutered (Multiply RER by 1.2)" },
      { value: 1, label: "Obesity Prone (Multiply RER by 1)" },
      { value: 0.8, label: "Weight Loss (Multiply RER by 0.8)" },
    ],
    Dog: [
      { value: 1.8, label: "Intact (Multiply RER by 1.8)" },
      { value: 1.6, label: "Neutered (Multiply RER by 1.6)" },
      { value: 1.4, label: "Obesity Prone (Multiply RER by 1.4)" },
      { value: 1, label: "Weight Loss (Multiply RER by 1)" },
      { value: 2, label: "Light Work (Multiply RER by 2)" },
      { value: 3, label: "Moderate Work (Multiply RER by 3)" },
      { value: 4, label: "Heavy Work (Multiply RER by 4 to 8)" },
    ],
  };

  const handleViewClick = (petId) => {
    navigate(`/profile/petprofile/${petId}`);
  };

  return (
    <div className="grid grid-cols-3 place-content-center bg-white rounded-2xl p-2">
      {petList.map((pet) => (
        <div
          key={pet.id}
          className="relative flex flex-col border border-gray-300
            max-w-sm mt-6 m-4 overflow-hidden
            bg-white rounded shadow-xl"
        >
          <div className="grid overflow-auto">
            <div>
              <div className="h-52">
                <img
                  src={
                    pet.imageURL ||
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="Pet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-6 py-4">
                <div className="mb-2 text-xl font-bold text-gray-900">
                  <h1 className="font-bold">{pet.name}</h1>
                </div>
                <p className="text-base text-gray-600">age: {pet.petAge}</p>
                <p className="text-base text-gray-600">
                  Weight (KG): {pet.weight}
                </p>
                <p className="text-base text-gray-600">
                  Pet Activity Level:
                  {activityLevelOptions[pet.petType] &&
                    activityLevelOptions[pet.petType].find(
                      (option) => option.value === pet.activityLevel
                    )?.label}
                </p>
                <p className="text-base text-gray-600">Food Selected:</p>
              </div>
            </div>
            <div className="flex item-center justify-center">
              <FeedAmountComponent
                petId={String(pet.id)}
                petName={String(pet.name)}
                petType={pet.petType}
                weight={Number(pet.weight)}
                activityLevel={Number(pet.activityLevel)}
                smartFeedingActivated={Boolean(smartFeedingActivated)}
                petFoodList={petFoodList}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 absolute top-0 right-0 m-2 cursor-pointer">
            <button
              onClick={() => handleViewClick(pet.id)}
              className="text-white font-bold flex items-center justify-center size-fit relative"
            >
              <div className="relative bg-mainColor hover:bg-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                <LuView className="size-6" />
              </div>
              <span className="absolute top-0 bg-darkViolet text-white px-2 mr-4 py-1 rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
                View
              </span>
            </button>
            <button
              onClick={() => deletePet(pet.id)}
              className="text-white font-bold flex items-center justify-center size-fit relative"
            >
              <div className="relative bg-mainColor hover:bg-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                <TiDelete className="size-6" />
              </div>
              <span className="absolute top-0 bg-darkViolet text-white px-2 mr-5 py-1 rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
                Delete
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

PetList.propTypes = {
  petList: PropTypes.array.isRequired,
  deletePet: PropTypes.func.isRequired,
  smartFeedingActivated: PropTypes.bool.isRequired,
  petFoodList: PropTypes.array.isRequired,
};

export default PetList;
