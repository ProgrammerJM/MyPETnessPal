import { useState } from "react";
import {
  doc,
  // addDoc,
  setDoc,
  getDoc,
  // getDocs,
  arrayUnion,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import PropTypes from "prop-types";

const FeedAmountComponent = ({
  petId,
  petName,
  petType,
  petFoodList,
  weight,
  activityLevel,
}) => {
  // State variables for managing various aspects of feeding
  const [scheduledFeedAmount, setScheduledFeedAmount] = useState(0);
  const [scheduledFeedingActivated, setScheduledFeedingActivated] =
    useState(false);

  // const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [feedingModeType, setFeedingModeType] = useState("");
  // const [feedingModeOptions, setFeedingModeOptions] = useState([]);

  const [servings, setServings] = useState(0);

  const [selectedFood, setSelectedFood] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // FOR FEEDING STATUS AND SERVINGS
  const [feedingStatus, setFeedingStatus] = useState(false); // Indicates if smart feeding mode is activated

  // Effect to fetch feeding mode options from Firestore on component mount
  // useEffect(() => {
  //   const fetchFeedingModeOptions = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "feedingModes"));
  //       const options = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setFeedingModeOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching feeding mode options:", error);
  //       // setError(error.message);
  //     }
  //   };

  //   fetchFeedingModeOptions();
  // }, []);

  // Firestore references
  const petFeedAmountsCollectionRef = collection(db, "feedingSchedule");
  const petDocRef = doc(petFeedAmountsCollectionRef, petName);

  // Function to handle feeding mode change
  const handleFeedingModeChange = async (selectedModeId) => {
    try {
      // Update feeding mode type
      setFeedingModeType(selectedModeId);

      // If selected mode is "Smart", clear scheduled feeding data
      if (selectedModeId === "Smart") {
        setScheduledDate("");
        setScheduledTime("");
        setScheduledFeedAmount("");
      }

      // If selected mode is "Scheduled", clear smart feeding data
      if (selectedModeId === "Scheduled") {
        setServings("");
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

  // check for caloriesPerGramPerPetFood in petFoodList
  // console.log(petFoodList.map((food) => food.caloriesPerGram));

  // Function to toggle the modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Function to calculate the next feeding time based on the current time and servings
  const calculateNextFeedingTime = (servings) => {
    const currentTime = new Date();
    const nextFeedingTimes = [];

    // Calculate next feeding times based on the current time and servings
    for (let i = 0; i < servings; i++) {
      const nextFeedingTime = new Date(currentTime);

      // Logic for determining next feeding time based on the number of servings
      if (servings === 1) {
        nextFeedingTime.setHours(12, 0, 0, 0); // One serving per day at 12:00 PM
      } else if (servings === 2) {
        if (i === 0) {
          nextFeedingTime.setHours(12, 0, 0, 0); // First serving at 12:00 PM
        } else {
          nextFeedingTime.setHours(18, 0, 0, 0); // Second serving at 6:00 PM
        }
      } else if (servings === 3) {
        if (i === 0) {
          nextFeedingTime.setHours(12, 0, 0, 0); // First serving at 12:00 PM
        } else if (i === 1) {
          nextFeedingTime.setHours(16, 0, 0, 0); // Second serving at 4:00 PM
        } else {
          nextFeedingTime.setHours(20, 0, 0, 0); // Third serving at 8:00 PM
        }
      }

      nextFeedingTimes.push(nextFeedingTime);
      console.log(nextFeedingTimes);
    }
    return nextFeedingTimes;
  };
  // Function to check if it's time for a serving
  const checkServingTime = (nextFeedingTimes) => {
    const currentTime = new Date();

    // Check if current time matches any of the next feeding times
    return nextFeedingTimes.some(
      (nextFeedingTime) => currentTime.getTime() === nextFeedingTime.getTime()
    );
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
      // Calculate the next feeding times based on the user-inputted number of servings
      const nextFeedingTimes = calculateNextFeedingTime(servings);

      // Check if it's time for a serving
      const isServingTime = checkServingTime(nextFeedingTimes);

      if (!isServingTime) {
        console.log("It's not time for a serving yet.");
        return; // Exit function if it's not time for a serving
      }

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

      // Activate smart feeding mode
      setFeedingStatus(true);

      // Construct the smart feeding schedule data
      const feedingSchedule = [];

      nextFeedingTimes.forEach((nextFeedingTime) => {
        feedingSchedule.push({
          petId: petId,
          petName: petName,
          petType: petType,
          feedingModeType: "Smart",
          servings: Number(servings),
          amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          selectedFood: selectedFood,
          feedingStatus: true,
          timestamp: nextFeedingTime,
        });
      });

      // Check if the document exists
      const petDocSnapshot = await getDoc(petDocRef);

      if (petDocSnapshot.exists()) {
        // Update the existing document in Firestore to add the new field of objects
        await updateDoc(petDocRef, {
          smartFeedingSchedule: arrayUnion(...feedingSchedule),
        });
      } else {
        // Create a new document in Firestore with the specified data
        await setDoc(petDocRef, {
          smartFeedingSchedule: feedingSchedule,
        });
      }

      // Close modal and reset state
      toggleModal();
      setFeedingModeType("");
      console.log("Smart Feeding Mode has been saved");
    } catch (error) {
      console.error("Error handling smart feeding submission:", error);
    }
  };

  // Function to handle submission of scheduled feeding data
  const handleScheduledFeedingSubmit = async () => {
    // Set scheduled feeding mode as activated
    setScheduledFeedingActivated(true);

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
        petId: petDocRef.id,
        petName: petName,
        petType: petType,
        feedingModeType: "Scheduled",
        scheduledFeedingActivated: scheduledFeedingActivated,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        selectedFood: selectedFood,
        amountToFeed: Number(scheduledFeedAmount),
        timestamp: Timestamp.now(),
      };
      // Check if the document exists
      const petDocSnapshot = await getDoc(petDocRef);

      if (petDocSnapshot.exists()) {
        // Update the existing document in Firestore to add the new scheduled feeding data
        await updateDoc(petDocRef, {
          scheduledFeedingSchedule: arrayUnion(scheduledFeedingData),
          scheduledFeedingActivated: true,
        });
      } else {
        // Create a new document in Firestore with the specified scheduled feeding data
        await setDoc(petDocRef, {
          scheduledFeedingSchedule: [scheduledFeedingData],
          scheduledFeedingActivated: true,
        });
      }

      // Reset error state
      // setError(null);

      // Reset state and close modal
      toggleModal();

      console.log("Scheduled Feeding Mode has been saved");
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

  // JSX for rendering the component
  return (
    <div>
      <div className="m-4">
        {/* Button to toggle the modal */}
        <button
          onClick={toggleModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Feeding Mode
        </button>
        {feedingStatus ? (
          <p>Smart feeding mode is activated</p>
        ) : (
          <p>No feeding mode activated</p>
        )}

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
