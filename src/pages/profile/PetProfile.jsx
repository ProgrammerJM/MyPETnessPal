import { useEffect, useState, useMemo } from "react";
import { db, auth, storage } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  // setDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  // uploadBytesResumable,
} from "firebase/storage";
import FeedAmountComponent from "./feedAmountComponent";
import GetWeight from "./getWeight";
import PropTypes from "prop-types";
import Records from "./Records";

export default function PetProfile({ petFoodList }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petList, setPetList] = useState([]);
  const [smartFeedingActivated, setSmartFeedingActivated] = useState(false);

  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("Cat");
  const [petWeight, setPetWeight] = useState(0);
  const [newPetActivityLevel, setNewPetActivityLevel] = useState(0); // Set default value based on pet type;

  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  // const [perc, setPerc] = useState(0);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  // GET PET LIST FUNCTION (USE FOR RENDERING PETS)
  const getPetList = async () => {
    try {
      const data = await getDocs(petCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPetList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPetList();
  }, []);

  // SMART FEEDING STATE TOGGLE WITH VALUE SAVED IN LOCAL STORAGE. TRUE/FALSE
  useEffect(() => {
    // Retrieve smart feeding activation state from localStorage
    const savedSmartFeedingState = localStorage.getItem(
      "smartFeedingActivated"
    );
    if (savedSmartFeedingState !== null) {
      setSmartFeedingActivated(JSON.parse(savedSmartFeedingState));
    }
  }, []);

  // TOGGLE MODAL STATE FUNCTION
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // UPLOAD FILE FUNCTION
  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;
      // const name = new Date().getTime() + file.name;
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

  // SAVE PET FUNCTION
  const onSavePet = async () => {
    try {
      // Generate custom ID for the pet food item
      const customId = "Pet " + (petList.length + 1); // Example: "Pet Name 1", "Pet Name 2", ...

      const docData = {
        name: newPetName,
        petType: newPetType,
        weight: petWeight,
        activityLevel: newPetActivityLevel,
        id: customId,
        userId: auth?.currentUser?.uid,
      };

      if (data.img) {
        docData.imageURL = data.img;
      }

      // Use `addDoc` instead of `setDoc` to let Firestore generate a unique ID
      await addDoc(petCollectionRef, docData);

      await getPetList();
      console.log("Data saved to Firestore with ID: ", customId);
    } catch (err) {
      console.error(err);
    }
    setNewPetName("");
    setNewPetType("Cat");
    setIsModalOpen(!isModalOpen);
  };

  // DELETE PET FUNCTION
  const deletePet = async (id) => {
    alert("Are you sure you want to delete this pet?");
    const petDocument = doc(db, "pets", id);
    await deleteDoc(petDocument);
  };

  // Define mappings between numeric values and their corresponding labels for both cats and dogs
  const activityLevelOptions = {
    Cat: [
      { value: 1.4, label: "Intact (Multiply RER by 1.4)" },
      { value: 1.2, label: "Neutered (Multiply RER by 1.2)" },
      { value: 1, label: "Obesity Prone (Multiply RER by 1)" },
      { value: 0.8, label: "Weight Loss (Multiply RER by 0.8)" },
      // Add more mappings for cats as needed
    ],
    Dog: [
      { value: 1.8, label: "Intact (Multiply RER by 1.8)" },
      { value: 1.6, label: "Neutered (Multiply RER by 1.6)" },
      { value: 1.4, label: "Obesity Prone (Multiply RER by 1.4)" },
      { value: 1, label: "Weight Loss (Multiply RER by 1)" },
      { value: 2, label: "Light Work (Multiply RER by 2)" },
      { value: 3, label: "Moderate Work (Multiply RER by 3)" },
      { value: 4, label: "Heavy Work (Multiply RER by 4 to 8)" },
      // Add more mappings for dogs as needed
    ],
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
        onClick={toggleModal}
      >
        + Add Pet
      </button>
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
                {/* SMART FEDING ACTIVATED  */}
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
              <Records />
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

      {/* FOR ADD PET MODAL  */}
      {isModalOpen && (
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
            </div>
            {/* GET PET WEIGHT FROM FIRESTORE */}
            <GetWeight setPetWeight={setPetWeight} />
            <div className="flex mt-5 justify-around">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSavePet}
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
      )}
    </div>
  );
}

PetProfile.propTypes = {
  petFoodList: PropTypes.array.isRequired,
};
