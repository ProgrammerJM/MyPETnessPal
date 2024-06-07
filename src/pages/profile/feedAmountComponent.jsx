import { useState, useEffect } from "react";
import { ref, push, get, set, remove, update } from "firebase/database";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { realtimeDatabase } from "../../config/firebase";
import PropTypes from "prop-types";

const FeedAmountComponent = ({
  // petId,
  petName,
  // petType,
  petFoodList,
  weight,
  activityLevel,
  latestFeedingInfo,
}) => {
  const [scheduledFeedAmount, setScheduledFeedAmount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedingModeType, setFeedingModeType] = useState("");
  const [servings, setServings] = useState(0);
  const [selectedFood, setSelectedFood] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledSubmitError, setScheduledSubmitError] = useState("");

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

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

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
      return { foodToDispensePerDay: 0 };
    }

    const caloriesPerGram = selectedFoodData.caloriesPerGram;

    if (selectedFoodId === "") {
      return { foodToDispensePerDay: 0 };
    }

    const foodToDispensePerDay = MER / caloriesPerGram / servings;

    return { RER, MER, servings, selectedFoodData, foodToDispensePerDay };
  };

  const handleSmartFeedingSubmit = async () => {
    try {
      const { RER, MER, selectedFoodData, foodToDispensePerDay } =
        calculateFoodToDispensePerDayForSmartFeeding(
          weight,
          activityLevel,
          selectedFood,
          petFoodList,
          servings
        );

      if (isNaN(foodToDispensePerDay) || foodToDispensePerDay === 0) {
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

      const snapshot = await get(petRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
          const smartFeeding = {
            selectedFood: selectedFood,
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          if (i < Number(servings)) {
            await update(
              ref(
                realtimeDatabase,
                `petFeedingSchedule/${petName}/smartFeeding/${keys[i]}`
              ),
              smartFeeding
            );
          } else {
            await remove(
              ref(
                realtimeDatabase,
                `petFeedingSchedule/${petName}/smartFeeding/${keys[i]}`
              )
            );
          }
        }

        for (let i = keys.length; i < Number(servings); i++) {
          const smartFeeding = {
            selectedFood: selectedFood,
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          await push(petRef, smartFeeding);
        }

        const feedingStatusRef = ref(
          realtimeDatabase,
          `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
        );
        await set(feedingStatusRef, true);
      } else {
        for (let i = 0; i < Number(servings); i++) {
          const smartFeeding = {
            selectedFood: selectedFood,
            petName: petName,
            feedingModeType: "Smart",
            servings: Number(servings),
            amountToDispensePerServingPerDay: Number(foodToDispensePerDay),
          };

          await push(petRef, smartFeeding);
        }

        const feedingStatusRef = ref(
          realtimeDatabase,
          `petFeedingSchedule/${petName}/smartFeeding/smartFeedingStatus`
        );
        await set(feedingStatusRef, true);
      }

      // Save the feeding information to Firestore (SMART FEEDING)
      await addDoc(feedingInformationsCollection, {
        RER: RER,
        MER: MER,
        caloriesPerGram: selectedFoodData.caloriesPerGram,
        foodSelectedName: selectedFoodData.name,
        createdAt: serverTimestamp(),
        feedingMode: "Smart",
        amountToFeed: foodToDispensePerDay,
      });

      setFeedingModeType("Smart");

      toggleModal();
      setServings(0);
      setSelectedFood("");
      console.log("Smart Feeding Mode has been saved");
    } catch (error) {
      console.error("Error handling smart feeding submission:", error);
    }
  };

  const handleScheduledFeedingSubmit = async () => {
    try {
      const { RER, MER, selectedFoodData } =
        calculateFoodToDispensePerDayForSmartFeeding(
          weight,
          activityLevel,
          selectedFood,
          petFoodList
        );

      if (
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
        caloriesPerGram: selectedFoodData.caloriesPerGram,
        foodSelectedName: selectedFoodData.name,
        createdAt: serverTimestamp(),
        feedingMode: "Scheduled",
      });

      const scheduledFeedingData = {
        selectedFood: selectedFood,
        petName: petName,
        feedingModeType: "Scheduled",
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        amountToFeed: Number(scheduledFeedAmount),
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

      toggleModal();

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
      <div className="flex flex-col items-center mx-4 py-2 px-4">
        <p className="text-bold font-medium">
          Current Feeding Mode: {feedingModeType}
        </p>
        <button
          onClick={toggleModal}
          className="text-white inline-flex items-center justify-center gap-2.5 bg-mainColor py-2 px-3 font-bold hover:bg-darkViolet mb-4"
        >
          Change Feeding Mode
        </button>

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
                    onClick={toggleModal}
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
                            <option key={food.id} value={food.name}>
                              {food.name} - {food.caloriesPerGram} Calories Per
                              g
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
                        Number of Servings:
                      </label>
                      <input
                        type="number"
                        id="servings"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
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
                              {food.name} - {food.caloriesPerGram} Calories Per
                              g
                            </option>
                          ))}
                        </select>
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
        {latestFeedingInfo && latestFeedingInfo.createdAt && (
          <div className="feeding-information">
            {/* Render the latest feeding information here */}
            <p className="text text-gray-600 mt-2 font-semibold">
              Resting Energy Requirement (RER):{" "}
              <span className="text-darkViolet">
                {latestFeedingInfo.RER.toFixed(2)} kcal/day
              </span>
            </p>
            <p className="text text-gray-600 mt-2 font-semibold">
              Maintenance Energy Requirement (MER):{" "}
              <span className="text-darkViolet">
                {latestFeedingInfo.MER.toFixed(2)} kcal/day
              </span>
            </p>
            <p className="text text-gray-600 mt-2 font-semibold">
              Date Started Feeding:{" "}
              <span className="text-darkViolet">
                {latestFeedingInfo.createdAt &&
                typeof latestFeedingInfo.createdAt.toDate === "function"
                  ? latestFeedingInfo.createdAt
                      .toDate()
                      .toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                  : "N/A"}
              </span>
            </p>
            <p className="text text-gray-600 mt-2 font-semibold">
              Selected Food:{" "}
              <span className="text-darkViolet">
                {latestFeedingInfo.foodSelectedName}
              </span>
            </p>
            <p className="text text-gray-600 mt-2 font-semibold">
              Food{`'`}s Calories Per Gram:{" "}
              <span className="text-darkViolet">
                {latestFeedingInfo.caloriesPerGram} kcal/g
              </span>
            </p>
          </div>
        )}
        {(!latestFeedingInfo || !latestFeedingInfo.createdAt) && (
          <p>No feeding information available</p>
        )}
      </div>
    </div>
  );
};

FeedAmountComponent.propTypes = {
  petName: PropTypes.string.isRequired,
  petFoodList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      caloriesPerGram: PropTypes.number.isRequired,
    })
  ).isRequired,
  weight: PropTypes.number.isRequired,
  activityLevel: PropTypes.number.isRequired,
  latestFeedingInfo: PropTypes.shape({
    RER: PropTypes.number,
    MER: PropTypes.number,
    caloriesPerGram: PropTypes.number,
    foodSelectedName: PropTypes.string,
    createdAt: PropTypes.object,
  }),
};

export default FeedAmountComponent;
