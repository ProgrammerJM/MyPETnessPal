// import { useState, useEffect } from "react";
// import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import PropTypes from "prop-types";

// const FeedAmountComponent = ({
//   petId,
//   petName,
//   petType,
//   weight,
//   activityLevel,
// }) => {
//   const [feedAmount, setFeedAmount] = useState(null);
//   const [computed, setComputed] = useState(false);
//   const [error, setError] = useState(null);
//   const [feedingModeType, setFeedingModeType] = useState(null); // Step 1: New state for selected feeding mode type
//   const [feedingModeOptions, setFeedingModeOptions] = useState([]); // Step 2: State to store feeding mode options

//   useEffect(() => {
//     const unsubscribe = onSnapshot(doc(db, "petFeedAmounts", petId), (doc) => {
//       if (doc.exists()) {
//         setComputed(doc.data().smartFeedingActivated);
//         setFeedAmount(doc.data().amount);
//       }
//     });
//     return () => unsubscribe();
//   }, [petId]);

//   const petFeedAmountsCollectionRef = collection(db, "petFeedAmounts");
//   const petFeedAmountDocRef = doc(petFeedAmountsCollectionRef, petId);

//   useEffect(() => {
//     if (computed) {
//       const computeFeedAmount = async () => {
//         try {
//           let baseAmount = 0;
//           switch (petType.toLowerCase()) {
//             case "dog":
//               baseAmount = weight * 0.02; // Assume 2% of weight for dogs
//               break;
//             case "cat":
//               baseAmount = weight * 0.03; // Assume 3% of weight for cats
//               break;
//             // Add more cases for other pet types as needed
//             default:
//               baseAmount = 0;
//           }
//           const adjustedAmount = baseAmount * (1 + activityLevel / 10);

//           setFeedAmount(adjustedAmount);

//           await setDoc(petFeedAmountDocRef, {
//             amount: adjustedAmount,
//             petType: petType,
//             petName: petName,
//             smartFeedingActivated: computed, // Save smart feeding state
//           });

//           setComputed(true);
//         } catch (error) {
//           setError(error.message);
//           console.error("Error saving feed amount:", error);
//         }
//       };

//       computeFeedAmount();
//     }
//   }, [computed]);

//   const toggleSmartFeeding = async () => {
//     try {
//       await setDoc(petFeedAmountDocRef, {
//         amount: feedAmount || 0, // Save current feed amount
//         petType: petType,
//         petName: petName,
//         smartFeedingActivated: !computed, // Toggle smart feeding state
//       });

//       setComputed(!computed);
//     } catch (err) {
//       console.error("Error toggling smart feeding:", err);
//     }
//   };

//   return (
//     <div>
//       <button onClick={toggleSmartFeeding} className="border p-2">
//         {computed ? "Disable Smart Feeding" : "Smart Feeding"}
//       </button>
//       {error && <p>Error: {error}</p>}
//       {computed && feedAmount !== null && (
//         <p>Amount to Feed in Grams (g) : {feedAmount}</p>
//       )}
//     </div>
//   );
// };

// FeedAmountComponent.propTypes = {
//   petId: PropTypes.string.isRequired,
//   petName: PropTypes.string.isRequired,
//   petType: PropTypes.string.isRequired,
//   weight: PropTypes.number.isRequired,
//   activityLevel: PropTypes.number.isRequired,
// };

// export default FeedAmountComponent;

import { useState, useEffect } from "react";
import {
  doc,
  addDoc,
  getDocs,
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

  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [feedingModeType, setFeedingModeType] = useState("");
  const [feedingModeOptions, setFeedingModeOptions] = useState([]);

  const [servings, setServings] = useState(0);

  const [selectedFood, setSelectedFood] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Effect to fetch feeding mode options from Firestore on component mount
  useEffect(() => {
    const fetchFeedingModeOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "feedingModes"));
        const options = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedingModeOptions(options);
      } catch (error) {
        console.error("Error fetching feeding mode options:", error);
        setError(error.message);
      }
    };

    fetchFeedingModeOptions();
  }, []);

  // Firestore references
  const petFeedAmountsCollectionRef = collection(db, "feedingModes");
  const petDocRef = doc(petFeedAmountsCollectionRef, petId);

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
    } else if (selectedFoodId === "Smart") {
      return MER / caloriesPerGram / servings;
    }
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

      await addDoc(petFeedAmountsCollectionRef, {
        petId: petDocRef.id,
        petName: petName,
        petType: petType,
        feedingModeType: "Smart",
        amountToDispensePerServing: Number(foodToDispensePerDay),
        timestamp: Timestamp.now(),
        selectedFood: selectedFood,
      });

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

      // Save data to Firestore
      await addDoc(petFeedAmountsCollectionRef, {
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
      });

      // Reset error state
      setError(null);

      // Reset state and close modal
      toggleModal();
      console.log("Scheduled Feeding Mode has been saved");
    } catch (error) {
      // Check if it's a validation error
      if (error.message === "Please fill in all required fields") {
        setError(error.message);
      } else {
        // Handle other errors
        console.error("Error handling scheduled feeding submission:", error);
      }
    }
  };

  // JSX for rendering the component
  return (
    <div className="m-4">
      {/* Button to toggle the modal */}
      <button
        onClick={toggleModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Feeding Mode
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
                {feedingModeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
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
                            {food.name} - {food.caloriesPerGram} Calories Per g
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
                            {food.name} - {food.caloriesPerGram} Calories Per g
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
      {/* Display error message if any */}
      {error && <p className="text-red-500">Error: {error}</p>}
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
