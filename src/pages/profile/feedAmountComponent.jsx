import { useState, useEffect, useContext } from "react";
import { ref, push, get, set } from "firebase/database";
import {
  collection,
  addDoc,
  serverTimestamp,
  // query,
  // orderBy,
  // limit,
  // getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { realtimeDatabase } from "../../config/firebase";
import { PetContext } from "../function/PetContext";
import Modal from "react-modal";
import PropTypes from "prop-types";

// Modal.setAppElement("#root");

const FeedAmountComponent = ({
  // petId,
  petName,
  // petType,
  weight,
  activityLevel,
  cageID,
  closeModal,
}) => {
  const { petFoodList } = useContext(PetContext);

  const [scheduledFeedAmount, setScheduledFeedAmount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedingModeType, setFeedingModeType] = useState("");
  const [servings, setServings] = useState(0);
  const [selectedFood, setSelectedFood] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledSubmitError, setScheduledSubmitError] = useState("");
  const [smartSubmitError, setSmartSubmitError] = useState("");
  const [submitConfirmation, setSubmitConfirmation] = useState(false);

  const feedingInformationsCollection = collection(
    db,
    `pets/${petName}/feedingInformations`
  );

  const handleFeedingModeChange = (selectedModeId) => {
    setFeedingModeType(selectedModeId);

    if (selectedModeId === "Smart") {
      setServings(0);
      setSelectedFood("");
    } else if (selectedModeId === "Scheduled") {
      setScheduledDate("");
      setScheduledTime("");
      setScheduledFeedAmount("");
    }
  };

  const handleCancel = () => {
    setFeedingModeType("");
    setModalOpen(!modalOpen);
  };

  const toggleModal = (mode) => {
    setFeedingModeType(mode);
    setModalOpen(!modalOpen);
  };

  const calculateFoodToDispensePerDayForSmartFeeding = (
    weight,
    activityLevel,
    selectedFoodId,
    petFoodList,
    servings
  ) => {
    console.log(
      `weight: ${weight}, activityLevel: ${activityLevel}, selectedFoodId: ${selectedFoodId}, servings: ${servings}`
    );

    const RER = 70 * Math.pow(weight, 0.75); // Calculate Resting Energy Requirement
    console.log(`Calculated RER: ${RER}`);

    const MER = RER * activityLevel; // Calculate Maintenance Energy Requirement
    console.log(`Calculated MER: ${MER}`);

    const selectedFoodData = petFoodList.find(
      (food) => food.id === selectedFoodId
    );
    console.log(`Selected food data: ${JSON.stringify(selectedFoodData)}`);

    if (!selectedFoodData) {
      console.error("Selected food data not found");
      return { RER, MER, foodToDispensePerDay: 0 };
    }

    // Convert kcalPerKg to caloriesPerGram
    const caloriesPerGram = selectedFoodData.kcalPerKg / 1000;
    console.log(`Calories per Gram: ${caloriesPerGram}`);

    if (selectedFoodId === "" || isNaN(caloriesPerGram) || servings <= 0) {
      console.error("Invalid food ID, calories per gram, or servings");
      return { RER, MER, foodToDispensePerDay: 0 };
    }

    // Calculate the amount of food to dispense per day
    const foodToDispensePerDay = MER / (caloriesPerGram * servings);
    console.log(`Food to Dispense per Day: ${foodToDispensePerDay}`);

    return {
      RER,
      MER,
      servings,
      selectedFoodData,
      foodToDispensePerDay,
      caloriesPerGram,
    };
  };

  const handleSmartFeedingSubmit = async () => {
    try {
      // Calculate the food to dispense per day for smart feeding
      const { RER, MER, foodToDispensePerDay } =
        calculateFoodToDispensePerDayForSmartFeeding(
          weight,
          activityLevel,
          selectedFood,
          petFoodList,
          servings
        );

      // Check if servings is a valid number and greater than 0
      if (isNaN(servings) || servings <= 0) {
        throw new Error("Invalid number of servings");
      }

      // Find the selected food data from the pet food list
      console.log("Pet food list:", petFoodList);
      const selectedFoodData = petFoodList.find(
        (food) => food.id === selectedFood
      );
      console.log("Selected food data:", selectedFoodData);

      // Check if the selected food data is found
      if (!selectedFoodData) {
        throw new Error("Selected food not found");
      }

      // Check if the calculated food to dispense per day is valid
      if (isNaN(foodToDispensePerDay) || foodToDispensePerDay <= 0) {
        throw new Error("Invalid food amount");
      }

      const petRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/smartFeeding`
      );

      const scheduledFeedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding/scheduledFeedingStatus`
      );
      const scheduledFeedingStatusSnapshot = await get(
        scheduledFeedingStatusRef
      );
      if (scheduledFeedingStatusSnapshot.exists()) {
        await set(scheduledFeedingStatusRef, false);
      }

      const smartFeeding = [
        {
          selectedFood: selectedFood,
          petName: petName,
          feedingModeType: "Smart",
          servings: Number(servings),
          amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          cageID: cageID,
        },
      ];

      // Update or create a single document with smart feeding data
      await set(petRef, smartFeeding);

      const feedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
      );
      await set(feedingStatusRef, true);

      // Save the feeding information to Firestore (SMART FEEDING)
      await addDoc(feedingInformationsCollection, {
        RER: RER,
        MER: MER,
        caloriesPerGram: selectedFoodData.kcalPerKg / 1000,
        foodSelectedName: selectedFoodData.name,
        createdAt: serverTimestamp(),
        feedingMode: "Smart",
        amountToFeed: foodToDispensePerDay,
        cageID: cageID,
      });

      setFeedingModeType("Smart");
      setSubmitConfirmation(true);

      toggleModal();
      closeModal();
      setServings(0);
      setSelectedFood("");
      console.log("Smart Feeding Mode has been saved");
    } catch (error) {
      console.error("Error handling smart feeding submission:", error);
      setSmartSubmitError("Please fill in all required fields");
    }
  };

  const calculateFoodForScheduledFeeding = (
    weight,
    activityLevel,
    selectedFoodId,
    petFoodList
  ) => {
    // Calculate RER and MER as per your original function
    const RER = 70 * Math.pow(weight, 0.75);
    console.log(`Calculated RER: ${RER}`);

    const MER = RER * activityLevel;
    console.log(`Calculated MER: ${MER}`);

    // Find the selected food data
    const selectedFoodData = petFoodList.find(
      (food) => food.id === selectedFoodId
    );
    console.log(`Selected food data: ${JSON.stringify(selectedFoodData)}`);

    if (!selectedFoodData) {
      console.error("Selected food data not found");
      return { RER, MER: 0, selectedFoodData: null };
    }

    const caloriesPerGram = selectedFoodData.kcalPerKg / 1000;
    console.log(`Calories per Gram: ${caloriesPerGram}`);

    if (selectedFoodId === "" || isNaN(caloriesPerGram)) {
      console.error("Invalid food ID or calories per gram");
      return { RER, MER: 0, selectedFoodData: null };
    }

    return {
      RER,
      MER,
      selectedFoodData,
      caloriesPerGram,
    };
  };

  const handleScheduledFeedingSubmit = async () => {
    try {
      const { RER, MER, selectedFoodData } = calculateFoodForScheduledFeeding(
        weight,
        activityLevel,
        selectedFood,
        petFoodList
      );

      if (
        !selectedFoodData ||
        !scheduledDate ||
        !scheduledTime ||
        !scheduledFeedAmount ||
        !selectedFood
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Save the feeding information to Firestore (SCHEDULED FEEDING)
      await addDoc(feedingInformationsCollection, {
        RER: RER,
        MER: MER,
        caloriesPerGram: selectedFoodData.kcalPerKg / 1000,
        foodSelectedName: selectedFoodData.name,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        amountToFeed: Number(scheduledFeedAmount),
        createdAt: serverTimestamp(),
        feedingMode: "Scheduled",
        cageID: cageID,
      });

      const scheduledFeedingData = {
        selectedFood: selectedFood,
        petName: petName,
        feedingModeType: "Scheduled",
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        amountToFeed: Number(scheduledFeedAmount),
        cageID: cageID,
      };

      const petRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding`
      );
      await push(petRef, scheduledFeedingData);

      const scheduledFeedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
      );
      const scheduledFeedingStatusSnapshot = await get(
        scheduledFeedingStatusRef
      );
      if (scheduledFeedingStatusSnapshot.exists()) {
        await set(scheduledFeedingStatusRef, false);
      }

      const feedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding/scheduledFeedingStatus`
      );
      await set(feedingStatusRef, true);

      setFeedingModeType("Scheduled");
      setSubmitConfirmation(true);

      toggleModal();
      closeModal();

      console.log("Scheduled Feeding Mode has been saved");

      setSelectedFood("");
      setScheduledDate("");
      setScheduledTime("");
      setScheduledFeedAmount(0);
    } catch (error) {
      console.error("Error handling scheduled feeding submission:", error);
      setScheduledSubmitError("Please fill in all required fields");
    }
  };

  useEffect(() => {
    const fetchFeedingMode = async () => {
      const smartFeedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
      );
      const scheduledFeedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding/scheduledFeedingStatus`
      );

      const [smartFeedingStatusSnapshot, scheduledFeedingStatusSnapshot] =
        await Promise.all([
          get(smartFeedingStatusRef),
          get(scheduledFeedingStatusRef),
        ]);

      let lastFeedingModeType = "None";

      if (
        smartFeedingStatusSnapshot.exists() &&
        smartFeedingStatusSnapshot.val() === true
      ) {
        lastFeedingModeType = "Smart";
      }

      if (
        scheduledFeedingStatusSnapshot.exists() &&
        scheduledFeedingStatusSnapshot.val() === true
      ) {
        lastFeedingModeType = "Scheduled";
      }

      setFeedingModeType(lastFeedingModeType);
    };

    fetchFeedingMode();
  }, [petName]);

  return (
    <div>
      <div className="flex items-center justify-center mb-2">
        <div className="flex items-center justify-center mb-2">
          <div className="flex flex-col text-center">
            <div className="m-2">
              <button
                onClick={() => toggleModal("Smart")}
                className={` h-12 px-4 font-semibold items-center  border border-white justify-center rounded-l-full focus:outline-none focus:ring-2 ${
                  feedingModeType === "Smart"
                    ? "bg-light-darkViolet text-white "
                    : "bg-gray-200 text-gray-600 "
                }`}
              >
                Smart Feeding
              </button>
              <button
                onClick={() => toggleModal("Scheduled")}
                className={` h-12 px-4 font-semibold items-center  border border-white justify-center rounded-r-full focus:outline-none focus:ring-2 ${
                  feedingModeType === "Scheduled"
                    ? "bg-light-darkViolet text-white "
                    : "bg-gray-200 text-gray-600 "
                }`}
              >
                Scheduled Feeding
              </button>
            </div>
            <div className="text-sm font-normal italic ">
              toggle to setup feeding mode
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={submitConfirmation}
        onRequestClose={() => setSubmitConfirmation(false)}
        contentLabel="Confirmation Modal"
        className="modal"
        overlayClassName="fixed inset-0 flex items-start justify-center" // Change items-center to items-start
      >
        <div className="flex items-center justify-between bg-light-darkViolet bg-opacity-90 shadow-lg p-2 rounded-lg">
          <h2 className="text-xl text-white font-semibold text-center mr-2">
            Feeding Mode has been saved
          </h2>
          <button
            onClick={() => setSubmitConfirmation(false)}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-light-darkViolet text-white hover:bg-light-darkViolet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </Modal>
      <div className="flex flex-col items-center mx-4 px-4">
        {modalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              &#8203;
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <button
                    onClick={handleCancel}
                    className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-800"
                    aria-label="Close"
                  >
                    &#x2715;
                  </button>
                  <label
                    htmlFor="feedingModeSelect"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Feeding Mode:
                  </label>
                  <select
                    id="feedingModeSelect"
                    value={feedingModeType}
                    onChange={(e) => handleFeedingModeChange(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a mode</option>
                    <option value="Smart">Smart Feeding</option>
                    <option value="Scheduled">Scheduled Feeding</option>
                  </select>

                  {feedingModeType === "Scheduled" && (
                    <div className="mt-4">
                      <label
                        htmlFor="scheduledDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Scheduled Date:
                      </label>
                      <input
                        type="date"
                        id="scheduledDate"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-required="true"
                      />
                      <label
                        htmlFor="scheduledTime"
                        className="block text-sm font-medium text-gray-700 mt-2"
                      >
                        Scheduled Time:
                      </label>
                      <input
                        type="time"
                        id="scheduledTime"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-required="true"
                      />
                      <label
                        htmlFor="scheduledAmount"
                        className="block text-sm font-medium text-gray-700 mt-2"
                      >
                        Amount to Feed (grams):
                      </label>
                      <input
                        type="number"
                        id="scheduledAmount"
                        value={scheduledFeedAmount}
                        onChange={(e) => setScheduledFeedAmount(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-required="true"
                      />
                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="foodSelect"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Food:
                        </label>
                        <select
                          id="foodSelect"
                          value={selectedFood}
                          onChange={(e) => setSelectedFood(e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-required="true"
                        >
                          <option value="">Select a food</option>
                          {petFoodList.map((food) => (
                            <option key={food.id} value={food.id}>
                              {food.name} - {food.kcalPerKg} Kcal Per Kg
                            </option>
                          ))}
                        </select>
                        {scheduledSubmitError && (
                          <p className="text-red-500 mt-2">
                            Please fill in all required fields
                          </p>
                        )}
                        <button
                          onClick={handleScheduledFeedingSubmit}
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}

                  {feedingModeType === "Smart" && (
                    <div className="mt-4">
                      <label
                        htmlFor="servings"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Number of Servings:
                      </label>
                      <select
                        id="servings"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-required="true"
                      >
                        <option value="">Select number of servings</option>
                        <option value={2}>2 servings per day</option>
                        <option value={3}>3 servings per day</option>
                      </select>
                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="foodSelect"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Food:
                        </label>
                        <select
                          id="foodSelect"
                          value={selectedFood}
                          onChange={(e) => setSelectedFood(e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-required="true"
                        >
                          <option value="">Select a food</option>
                          {petFoodList.map((food) => (
                            <option key={food.id} value={food.id}>
                              {food.name} - {food.kcalPerKg} Kcal Per Kg
                            </option>
                          ))}
                        </select>
                        {smartSubmitError && (
                          <p className="text-red-500 mt-2">
                            Please fill in all required fields
                          </p>
                        )}
                        <button
                          onClick={handleSmartFeedingSubmit}
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FeedAmountComponent.propTypes = {
  petName: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  activityLevel: PropTypes.number.isRequired,
  cageID: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  petId: PropTypes.string.isRequired,
  petType: PropTypes.string.isRequired,
};

export default FeedAmountComponent;
