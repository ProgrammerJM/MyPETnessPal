import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { db, auth } from "../../config/firebase";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { PetContext } from "../function/PetContext";
import { BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip } from "recharts";

export default function Tank() {
  const { petFoodList, setPetFoodList } = useContext(PetContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPetFoodName, setNewPetFoodName] = useState("");
  const [newFoodKCaloriesPerGram, setNewFoodKCaloriesPerGram] = useState(0);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [errorAddFood, setErrorAddFood] = useState("");

  const petFoodCollectionRef = useMemo(() => collection(db, "petFoodList"), []);

  const getPetFoodList = useCallback(async () => {
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
  }, [petFoodCollectionRef]);

  useEffect(() => {
    getPetFoodList(); // Fetch pet food list on component mount
  }, [getPetFoodList]); // Only run on mount, memoized getPetFoodList function

  const toggleModal = () => {
    if (petFoodList.length >= 2) {
      setErrorAddFood("You cannot add more than 2 food options.");
    } else {
      setIsModalOpen(!isModalOpen);
      setEditingFoodId(null);
      setErrorAddFood("");
    }
  };

  const getNextFoodId = () => {
    const ids = petFoodList.map((food) => food.id);
    if (!ids.includes("food_01")) return "food_01";
    if (!ids.includes("food_02")) return "food_02";
    return null; // No available ID
  };

  const onSavePetFood = async () => {
    if (petFoodList.length >= 2 && !editingFoodId) {
      setErrorAddFood("You can only add up to 2 pet foods.");
      return;
    }

    try {
      const docData = {
        name: newPetFoodName,
        kcalPerKg: newFoodKCaloriesPerGram,
        id: editingFoodId || getNextFoodId(),
        userId: auth?.currentUser?.uid,
        date: new Date(),
      };

      if (!docData.id) {
        setErrorAddFood("No available ID for new food.");
        return;
      }

      if (editingFoodId) {
        // Update existing pet food item
        const docRef = doc(petFoodCollectionRef, editingFoodId);
        await setDoc(docRef, docData);
        setEditingFoodId(null);
      } else {
        // Add new pet food item
        const docRef = doc(petFoodCollectionRef, docData.id);
        await setDoc(docRef, docData);
      }

      await getPetFoodList();
    } catch (err) {
      console.error(err);
    }
    setNewPetFoodName("");
    setNewFoodKCaloriesPerGram(0);
    setIsModalOpen(false);
  };

  const deleteFood = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet food?"
    );
    if (confirmed) {
      try {
        const petFoodDocument = doc(db, "petFoodList", id);
        await deleteDoc(petFoodDocument);
        await getPetFoodList();
      } catch (err) {
        console.error("Error deleting food:", err);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFoodId(null);
    setErrorAddFood("");
  };

  const openEditModal = (food) => {
    setNewPetFoodName(food.name);
    setNewFoodKCaloriesPerGram(food.caloriesPerGram);
    setEditingFoodId(food.id);
    setIsModalOpen(true);
  };

  const data = [{ name: "Tank Container Status", value: 100 }];

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
        onClick={toggleModal}
      >
        + Add Food Option
      </button>
      {errorAddFood && <p className="text-red-500">{errorAddFood}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-center h-full">
        {petFoodList.map((food) => (
          <div
            key={food.id}
            className="relative flex flex-col border border-gray-300 rounded-md mt-8 p-4 mb-2 w-full h-full overflow-hidden shadow-md bg-white"
          >
            <div className="flex">
              <div className="m-2">
                <h2 className="font-bold w-auto">Pet Food Name: {food.name}</h2>
                <h2 className="text-gray-600">Kcal Per kg: {food.kcalPerKg}</h2>
              </div>
              <div className="flex h-fit w-fit m-2">
                <button
                  onClick={() => openEditModal(food)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFood(food.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
              </BarChart>
            </div>
            <p className="text-center text-green-500 mt-2">Full</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md flex flex-col max-h-full overflow-auto mb-32">
            <h1>{editingFoodId ? "EDIT FOOD OPTION" : "CREATE FOOD OPTION"}</h1>
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
                placeholder="E.g PEDIGREE Healthy Weight Roasted Chicken & Vegetable Flavor Dry Dog Food"
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
                KCal per kg
              </label>
              <input
                type="number"
                placeholder="E.g 3253 KCalories per kilogram"
                value={newFoodKCaloriesPerGram}
                onChange={(e) => setNewFoodKCaloriesPerGram(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex mt-5 justify-between">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSavePetFood}
              >
                {editingFoodId ? "Update" : "Save"}
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
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
