import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../config/firebase";
import { db } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { PetContext } from "../function/PetContext";
import Modal from "react-modal";

const AddPetModal = ({ isModalOpen, toggleModal }) => {
  const { setPetList } = useContext(PetContext);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("");
  const [newPetActivityLevel, setNewPetActivityLevel] = useState(0);
  const [addPetError, setAddPetError] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        activityLevel: newPetActivityLevel,
        id: newPetName,
        userId: auth?.currentUser?.uid,
        createdAt: serverTimestamp(),
      };

      if (data.img) {
        docData.imageURL = data.img;
      }

      await setDoc(doc(db, "pets", customId), docData);
      setPetList((prev) => [...prev, docData]);
      setShowSuccessModal(true);
      console.log("Data saved to Firestore with ID: ", customId);
    } catch (err) {
      console.error(err);
    }
    setFile(null);
    setNewPetName("");
    setNewPetType("");
    setNewPetActivityLevel(0);
    toggleModal();
  };

  useEffect(() => {
    if (
      activityLevelOptions[newPetType] &&
      activityLevelOptions[newPetType].length > 0
    ) {
      setNewPetActivityLevel(activityLevelOptions[newPetType][0].value);
    }
  }, [newPetType]);

  const activityLevelOptions = {
    "": [{ value: 0, label: "Select Pet Type" }],
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
    <>
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        contentLabel="Success Modal"
        className="modal"
        overlayClassName="fixed inset-0 flex items-start justify-center"
      >
        <div className="flex items-center justify-between bg-light-darkViolet bg-opacity-90 shadow-lg p-2 rounded-lg">
          <h2 className="text-xl text-white font-semibold text-center mr-2">
            Pet successfully added!
          </h2>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-light-darkViolet text-white hover:bg-light-darkViolet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </Modal>

      {isModalOpen && (
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
                  {activityLevelOptions[newPetType].map(
                    ({ value, label }, index) => (
                      <option
                        key={`${newPetType}-${value}-${index}`}
                        value={value}
                      >
                        {label}
                      </option>
                    )
                  )}
                </select>
                {addPetError && (
                  <p className="text-red-500 mt-2">{addPetError}</p>
                )}
              </div>
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
              <div className="flex mt-16 justify-evenly items-center">
                <button
                  className="bg-light-darkViolet hover:bg-light-mainColor text-white font-bold py-2 px-4 rounded h-fit border-solid border-2 border-light-darkViolet"
                  onClick={onSavePet}
                >
                  Save
                </button>
                <button
                  className="bg-light-white hover:bg-light-darkViolet text-black font-bold py-2 px-4 rounded h-fit border-solid border-2 border-light-darkViolet"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AddPetModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddPetModal;
