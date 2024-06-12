import { useState, useEffect, useMemo, useCallback } from "react";
import { db, auth } from "../../config/firebase";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import PropTypes from "prop-types";
import { BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip } from "recharts";

export default function Tank() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petFoodList, setPetFoodList] = useState([]);
  const [newPetFoodName, setNewPetFoodName] = useState("");
  const [newFoodCaloriesPerGram, setNewFoodCaloriesPerGram] = useState(0);
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

  const onSavePetFood = async () => {
    if (petFoodList.length >= 2 && !editingFoodId) {
      setErrorAddFood("You can only add up to 2 pet foods.");
      return;
    }

    try {
      const docData = {
        name: newPetFoodName,
        caloriesPerGram: Number(newFoodCaloriesPerGram),
        id: newPetFoodName,
        userId: auth?.currentUser?.uid,
        date: new Date(),
      };

      if (editingFoodId) {
        // Update existing pet food item
        const docRef = doc(petFoodCollectionRef, editingFoodId);
        await setDoc(docRef, docData);
        setEditingFoodId(null);
      } else {
        // Add new pet food item
        const docRef = doc(petFoodCollectionRef, newPetFoodName);
        await setDoc(docRef, docData);
      }

      await getPetFoodList();
    } catch (err) {
      console.error(err);
    }
    setNewPetFoodName("");
    setNewFoodCaloriesPerGram(0);
    setIsModalOpen(false);
  };

  const deleteFood = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet food?"
    );
    if (confirmed) {
      const petFoodDocument = doc(db, "petFoodList", id);
      await deleteDoc(petFoodDocument);
      await getPetFoodList();
    }
  };

  const openEditModal = (food) => {
    setNewPetFoodName(food.name);
    setNewFoodCaloriesPerGram(food.caloriesPerGram);
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
                value={newFoodCaloriesPerGram}
                onChange={(e) => setNewFoodCaloriesPerGram(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex mt-5 justify-around">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSavePetFood}
              >
                {editingFoodId ? "Update" : "Save"}
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
