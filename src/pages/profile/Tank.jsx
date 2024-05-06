import { useState, useEffect, useMemo } from "react";
import { db, auth } from "../../config/firebase";
import {
  doc,
  // addDoc,
  deleteDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import PropTypes from "prop-types";

export default function Tank() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petFoodList, setPetFoodList] = useState([]);
  const [newPetFoodName, setNewPetFoodName] = useState("");
  const [newFoodCaloriesPerGram, setNewFoodCaloriesPerGram] = useState(0);

  const petFoodCollectionRef = useMemo(() => collection(db, "petFoodList"), []);

  const getPetFoodList = async () => {
    try {
      const data = await getDocs(petFoodCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPetFoodList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPetFoodList(); // Fetch pet food list on component mount
  }, []); // Empty dependency array ensures it runs only once

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onSavePetFood = async () => {
    try {
      // Generate custom ID for the pet food item
      const customId = "Pet Food " + (petFoodList.length + 1); // Example: "Pet Food 1", "Pet Food 2", ...

      const docData = {
        name: newPetFoodName,
        caloriesPerGram: Number(newFoodCaloriesPerGram),
        userId: auth?.currentUser?.uid,
        date: new Date(),
        id: customId,
      };

      const docRef = doc(petFoodCollectionRef, customId); // Create document reference with custom ID

      await setDoc(docRef, docData);

      await getPetFoodList();

      console.log("Data saved to Firestore with ID: ", customId);
    } catch (err) {
      console.error(err);
    }
    setNewPetFoodName("");
    setNewFoodCaloriesPerGram(0);
    setIsModalOpen(!isModalOpen);
  };

  const deleteFood = async (id) => {
    alert("Are you sure you want to delete this pet?");
    const petFoodDocument = doc(db, "petFoodList", id);
    await deleteDoc(petFoodDocument);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
        onClick={toggleModal}
      >
        + Add Food Option
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {petFoodList.map((food) => (
          <div
            key={food.id}
            className="relative flex flex-col border border-gray-300 rounded-md p-4 mb-2"
          >
            <div className="ml-4">
              <h2 className="font-bold">Pet Food Name: {food.name}</h2>
              <h2 className="text-gray-600">
                Calories Per Gram: {food.caloriesPerGram}
              </h2>
            </div>
            <div className="absolute top-0 right-0 m-2">
              <button
                onClick={() => deleteFood(food.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md flex flex-col max-h-full overflow-auto mb-32">
            <h1>CREATE FOOD OPTION</h1>
            <hr />
            <div className="flex flex-col mb-4 mt-4">
              <label
                htmlFor="petName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Pet Food Name:
              </label>
              <input
                type="text"
                placeholder="E.g PEDIGREE® Adult 1+ Years Chicken & Vegetables Flavor"
                value={newPetFoodName}
                onChange={(e) => setNewPetFoodName(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label
                htmlFor="petName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Calories Per Gram
              </label>
              <input
                type="number"
                placeholder="E.g 348 grams"
                onChange={(e) => setNewFoodCaloriesPerGram(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex mt-5 justify-around">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSavePetFood}
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
    </>
  );
}

Tank.propTypes = {
  petFoodList: PropTypes.array.isRequired,
};
