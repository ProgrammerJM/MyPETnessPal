import { useState, useEffect } from "react";
import { ref, push, get, set, remove, update } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import PropTypes from "prop-types";

const FeedAmountComponent = ({
  // petId,
  petName,
  // petType,
  petFoodList,
  weight,
  activityLevel,
}) => {
  // State variables for managing various aspects of feeding
  const [scheduledFeedAmount, setScheduledFeedAmount] = useState(0);

  // const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for Feeding ModeType
  const [feedingModeType, setFeedingModeType] = useState("");

  const [servings, setServings] = useState(0);

  const [selectedFood, setSelectedFood] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Function to handle feeding mode change
  const handleFeedingModeChange = async (selectedModeId) => {
    try {
      // Update feeding mode type
      setFeedingModeType(selectedModeId);

      // If selected mode is "Smart", clear scheduled feeding data
      if (selectedModeId === "Smart") {
        setServings(0);
        setSelectedFood("");
      }

      // If selected mode is "Scheduled", clear smart feeding data
      if (selectedModeId === "Scheduled") {
        setSelectedFood("");
        setScheduledDate("");
        setScheduledTime("");
        setScheduledFeedAmount("");
      }

      // If a mode is selected, submit the form
      if (selectedModeId !== "") {
        // If it's a scheduled feeding, submit the form immediately
        if (selectedModeId === "Scheduled") {
          await handleScheduledFeedingSubmit();
        }
      }
    } catch (error) {
      console.error("Error handling feeding mode change:", error);
    }
  };

  // Function to toggle the modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Function to calculate food to dispense per day for smart feeding
  const calculateFoodToDispensePerDayForSmartFeeding = (
    weight,
    activityLevel,
    selectedFoodId,
    petFoodList,
    servings
  ) => {
    const RER = 70 * Math.pow(weight, 0.75);
    const MER = RER * activityLevel;
    const selectedFoodData = petFoodList.find(
      (food) => food.id === selectedFoodId
    );

    if (!selectedFoodData) {
      return 0;
    }

    const caloriesPerGram = selectedFoodData.caloriesPerGram;

    if (selectedFoodId === "") {
      return 0;
    }

    return MER / caloriesPerGram / servings;
  };

  // Function to handle submission of smart feeding data
  const handleSmartFeedingSubmit = async () => {
    try {
      const foodToDispensePerDay = calculateFoodToDispensePerDayForSmartFeeding(
        weight,
        activityLevel,
        selectedFood,
        petFoodList,
        servings
      );

      if (isNaN(foodToDispensePerDay) || foodToDispensePerDay === 0) {
        throw new Error("Invalid food amount");
      }

      // Construct the smart feeding schedule data and push it directly
      const petRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/smartFeeding`
      );

      // Fetch the existing scheduled feeding data and set scheduledFeedingStatus to false
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

      // Get the current data
      const snapshot = await get(petRef);

      if (snapshot.exists()) {
        // Data exists, update it
        const data = snapshot.val();
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
          const smartFeeding = {
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          if (i < Number(servings)) {
            // Update existing data
            await update(
              ref(
                realtimeDatabase,
                `petFeedingSchedule/${petName}/smartFeeding/${keys[i]}`
              ),
              smartFeeding
            );
          } else {
            // Delete extra data
            await remove(
              ref(
                realtimeDatabase,
                `petFeedingSchedule/${petName}/smartFeeding/${keys[i]}`
              )
            );
          }
        }

        // If the number of servings is greater than the number of existing data, push new data
        for (let i = keys.length; i < Number(servings); i++) {
          const smartFeeding = {
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          await push(petRef, smartFeeding);
        }

        // Update feedingStatus under smartFeeding
        const feedingStatusRef = ref(
          realtimeDatabase,
          `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
        );
        await set(feedingStatusRef, true);
      } else {
        // Data does not exist, push new data
        for (let i = 0; i < Number(servings); i++) {
          const smartFeeding = {
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          // Push the data to the Realtime Database
          await push(petRef, smartFeeding);
        }

        // Set feedingStatus under smartFeeding
        const feedingStatusRef = ref(
          realtimeDatabase,
          `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
        );
        await set(feedingStatusRef, true);
      }

      // Close modal and reset state
      toggleModal();
      // Reset state
      setServings(0);
      setSelectedFood("");
      console.log("Smart Feeding Mode has been saved");
    } catch (error) {
      console.error("Error handling smart feeding submission:", error);
    }
  };

  // Function to handle submission of scheduled feeding data
  const handleScheduledFeedingSubmit = async () => {
    try {
      // Check if all required fields are filled
      if (
        !selectedFood ||
        !scheduledDate ||
        !scheduledTime ||
        !scheduledFeedAmount
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Construct the scheduled feeding data
      const scheduledFeedingData = {
        petName: petName,
        feedingModeType: "Scheduled",
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        amountToFeed: Number(scheduledFeedAmount),
      };

      // Push the data to the Realtime Database
      const petRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding`
      );
      await push(petRef, scheduledFeedingData);

      // Fetch the existing scheduled feeding data and set smartFeedingStatus to false
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

      // Set the feeding status to true
      const feedingStatusRef = ref(
        realtimeDatabase,
        `petFeedingSchedule/${petName}/scheduledFeeding/scheduledFeedingStatus`
      );
      await set(feedingStatusRef, true);

      // Reset state and close modal
      toggleModal();

      console.log("Scheduled Feeding Mode has been saved");

      // Reset all of options after successful saved
      setSelectedFood("");
      setScheduledDate("");
      setScheduledTime("");
      setScheduledFeedAmount(0);
    } catch (error) {
      // Check if it's a validation error
      if (error.message === "Please fill in all required fields") {
        // setError(error.message);
      } else {
        // Handle other errors
        console.error("Error handling scheduled feeding submission:", error);
      }
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
  }, []);

  // JSX for rendering the component
  return (
    <div>
      <div className="flex flex-col items-center mx-4 py-2 px-4 ">
        {/* Button to toggle the modal */}
        <p className="text-bold font-medium">
          Selected Mode: {feedingModeType}
        </p>
        <button
          onClick={toggleModal}
          className="text-white inline-flex items-center justify-center gap-2.5 bg-mainColor  py-2 px-3
          text-bold font-medium hover:bg-darkViolet mb-4 "
        >
          Change Feeding Mode
        </button>

        {/* Modal for selecting feeding mode and entering data */}
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
                  {/* Close button for the modal */}
                  <button
                    onClick={toggleModal}
                    className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-800"
                  >
                    &#x2715;
                  </button>
                  {/* Select feeding mode dropdown */}
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
                  {/* Feeding mode options */}
                  {/* Inputs for scheduled feeding */}
                  {feedingModeType === "Scheduled" && (
                    <div className="mt-4">
                      {/* Scheduled date input */}
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
                      />
                      {/* Scheduled time input */}
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
                      />
                      {/* Scheduled amount input */}
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
                      />
                      {/* Select food dropdown */}
                      <div className="flex flex-col mt-4">
                        <label htmlFor="foodSelect">Select Food:</label>
                        <select
                          id="foodSelect"
                          value={selectedFood}
                          onChange={(e) => setSelectedFood(e.target.value)}
                        >
                          <option value="">Select a food</option>
                          {petFoodList.map((food) => (
                            <option key={food.id} value={food.id}>
                              {food.name} - {food.caloriesPerGram} Calories Per
                              g
                            </option>
                          ))}
                        </select>
                        {/* Error message for required fields */}
                        {(!selectedFood ||
                          !scheduledDate ||
                          !scheduledTime ||
                          !scheduledFeedAmount) && (
                          <p className="text-red-500">
                            Please fill in all required fields
                          </p>
                        )}
                        {/* Submit button for scheduled feeding */}
                        <button
                          onClick={handleScheduledFeedingSubmit}
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Inputs for smart feeding */}
                  {feedingModeType === "Smart" && (
                    <div className="mt-4">
                      {/* Servings input */}
                      <label
                        htmlFor="servings"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Number of Servings:
                      </label>
                      <input
                        type="number"
                        id="servings"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {/* Select food dropdown */}
                      <div className="flex flex-col mt-4">
                        <label htmlFor="foodSelect">Select Food:</label>
                        <select
                          id="foodSelect"
                          value={selectedFood}
                          onChange={(e) => setSelectedFood(e.target.value)}
                        >
                          <option value="">Select a food</option>
                          {petFoodList.map((food) => (
                            <option key={food.id} value={food.id}>
                              {food.name} - {food.caloriesPerGram} Calories Per
                              g
                            </option>
                          ))}
                        </select>
                        {/* Submit button for smart feeding */}
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

// PropTypes for type-checking
FeedAmountComponent.propTypes = {
  petId: PropTypes.string.isRequired,
  petName: PropTypes.string.isRequired,
  petType: PropTypes.string.isRequired,
  petFoodList: PropTypes.array.isRequired,
  weight: PropTypes.number.isRequired,
  activityLevel: PropTypes.number.isRequired,
};

export default FeedAmountComponent;
