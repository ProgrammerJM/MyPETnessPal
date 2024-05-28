// PetList.jsx
import PropTypes from "prop-types";
import FeedAmountComponent from "./feedAmountComponent";
import Records from "./Records";

const PetList = ({
  petList,
  petFoodList,
  smartFeedingActivated,
  deletePet,
}) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {petList.map((pet) => (
        <div
          key={pet.id}
          className="relative flex flex-col border border-gray-300 rounded-md p-4 mb-2"
        >
          <div className="grid grid-cols-3 overflow-auto">
            <div>
              <div className="w-40 h-40 rounded-xl overflow-hidden justify-center ml-4 mb-4">
                <img
                  src={
                    pet.imageURL ||
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="Pet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h1 className="font-bold">{pet.name}</h1>
                <p className="text-gray-600">Pet Type: {pet.petType}</p>
                <p className="text-gray-600">Weight (KG): {pet.weight}</p>
                <p className="text-gray-600">
                  Pet Activity Level:
                  {activityLevelOptions[pet.petType] &&
                    activityLevelOptions[pet.petType].find(
                      (option) => option.value === pet.activityLevel
                    )?.label}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-end">
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
            <Records customId={pet.id} />
          </div>
          <div className="absolute top-0 right-0 m-2">
            <button
              onClick={() => deletePet(pet.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

PetList.propTypes = {
  petList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      petType: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      activityLevel: PropTypes.number.isRequired,
      imageURL: PropTypes.string,
    })
  ).isRequired,
  petFoodList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      brand: PropTypes.string,
      weight: PropTypes.number,
    })
  ).isRequired,
  smartFeedingActivated: PropTypes.bool.isRequired,
  deletePet: PropTypes.func.isRequired,
};

export default PetList;
