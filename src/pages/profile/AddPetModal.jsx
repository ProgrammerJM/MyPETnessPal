import { useState } from "react";
import PropTypes from "prop-types";
import GetWeight from "./getWeight";

const AddPetModal = ({ toggleModal, onSavePet, setFile, file }) => {
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("Cat");
  const [petWeight, setPetWeight] = useState(0);
  const [newPetActivityLevel, setNewPetActivityLevel] = useState(0);

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

  const handleSave = () => {
    onSavePet({
      name: newPetName,
      petType: newPetType,
      weight: petWeight,
      activityLevel: newPetActivityLevel,
    });
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md flex flex-col max-h-full overflow-auto">
        <h1 className="text-xl font-semibold mb-4">CREATE PROFILE</h1>
        <hr />
        <div className="flex justify-center items-center my-6">
          <label
            htmlFor="fileInput"
            className="relative w-48 h-48 overflow-hidden rounded-full cursor-pointer"
          >
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
              className="w-full h-full object-cover"
            />
            <input
              id="fileInput"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="petName"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Pet Name:
          </label>
          <input
            id="petName"
            type="text"
            placeholder="Enter pet's name"
            value={newPetName}
            onChange={(e) => setNewPetName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="petType"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Pet Type:
          </label>
          <select
            id="petType"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={newPetType}
            onChange={(e) => setNewPetType(e.target.value)}
          >
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="activityLevel"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Activity Level:
          </label>
          <select
            id="activityLevel"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={newPetActivityLevel}
            onChange={(e) => setNewPetActivityLevel(parseFloat(e.target.value))}
          >
            {activityLevelOptions[newPetType].map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <GetWeight setPetWeight={setPetWeight} />
        <div className="flex mt-5 justify-around">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddPetModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  onSavePet: PropTypes.func.isRequired,
  setFile: PropTypes.func.isRequired,
  file: PropTypes.object,
};

export default AddPetModal;
