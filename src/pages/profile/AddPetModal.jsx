import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import GetWeight from "./getWeight";
import { auth, storage } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const AddPetModal = ({
  isModalOpen,
  toggleModal,
  getPetList,
  petCollectionRef,
}) => {
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("");
  const [petWeight, setPetWeight] = useState(0);
  const [newPetActivityLevel, setNewPetActivityLevel] = useState(0);
  const [addPetError, setAddPetError] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;
      const name = file.name;
      const filesFolderRef = ref(storage, `petImages/${name}`);

      try {
        await uploadBytes(filesFolderRef, file);
        const downloadURL = await getDownloadURL(filesFolderRef);
        setData((prev) => ({ ...prev, img: downloadURL }));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    uploadFile();
  }, [file]);

  const onSavePet = async () => {
    if (
      !newPetName ||
      !newPetType ||
      newPetActivityLevel === null ||
      newPetActivityLevel === undefined
    ) {
      setAddPetError("Please fill in all required fields");
      return;
    }

    try {
      const customId = newPetName;

      const docData = {
        name: newPetName,
        petType: newPetType,
        weight: petWeight,
        activityLevel: newPetActivityLevel,
        id: newPetName,
        userId: auth?.currentUser?.uid,
        createdAt: serverTimestamp(),
      };

      if (data.img) {
        docData.imageURL = data.img;
      }

      await setDoc(doc(petCollectionRef, customId), docData);
      await getPetList();
      console.log("Data saved to Firestore with ID: ", customId);
    } catch (err) {
      console.error(err);
    }
    setFile(null);
    setNewPetName("");
    setNewPetType("");
    setPetWeight(0);
    toggleModal();
  };

  useEffect(() => {
    // Check if there are activity level options for the selected pet type
    if (
      activityLevelOptions[newPetType] &&
      activityLevelOptions[newPetType].length > 0
    ) {
      // Set the activity level to the first option for the selected pet type
      setNewPetActivityLevel(activityLevelOptions[newPetType][0].value);
    }
  }, [newPetType]);

  const activityLevelOptions = {
    "": [{ value: 0, label: "Select Pet Type" }], // Add an empty option for the "Select an option" message
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
    isModalOpen && (
      <div className="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-10 rounded-md flex max-h-full overflow-auto">
          <div className="flex flex-col">
            <div className="flex flex-col mb-4">
              <h1 className="text-xl font-semibold">CREATE PET PROFILE</h1>
              <hr />
              <label
                htmlFor="petName"
                className="text-sm font-medium text-gray-700 mt-4 mb-1"
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
                aria-required="true"
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
                <option value="">Select an option</option>
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
              </select>
            </div>
            <div className="flex flex-col mb-auto">
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
                onChange={(e) =>
                  setNewPetActivityLevel(parseFloat(e.target.value))
                }
              >
                {activityLevelOptions[newPetType].map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {addPetError && (
                <p className="text-red-500 mt-2">{addPetError}</p>
              )}
            </div>
            <GetWeight setPetWeight={setPetWeight} />
            {/* {(!newPetName || !newPetType || !newPetActivityLevel) && (
              <p className="text-red-500">Please fill in all required fields</p>
            )} */}
          </div>
          <div className="flex flex-col ml-10 justify-center">
            <div className="flex justify-center items-center mt-16">
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
                  className="w-full h-full object-cover items-center"
                />
                <input
                  id="fileInput"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <div className="flex mt-16 justify-evenly">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded h-fit"
                onClick={onSavePet}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-fit"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

AddPetModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  getPetList: PropTypes.func.isRequired,
  petCollectionRef: PropTypes.object.isRequired,
};

export default AddPetModal;
