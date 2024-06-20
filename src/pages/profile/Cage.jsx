import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import FeedAmountComponent from "./feedAmountComponent";
import { PetContext } from "../../pages/function/PetContext";
import { ref, onValue, set, remove } from "firebase/database";
import { realtimeDatabase, db } from "../../config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { TiDelete } from "react-icons/ti";

Modal.setAppElement("#root");

export default function Cage() {
  const { petList, petRecords, latestFeedingInfo } = useContext(PetContext);

  const initialCages = useMemo(
    () => [
      { id: "cage_01", pet: null },
      { id: "cage_02", pet: null },
      { id: "cage_03", pet: null },
      { id: "cage_04", pet: null },
    ],
    []
  );

  const [cages, setCages] = useState(initialCages);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCageIndex, setSelectedCageIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cageFetchingWeight, setCageFetchingWeight] = useState({});
  const [cageWeights, setCageWeights] = useState({});

  const fetchCages = useCallback(async () => {
    try {
      setLoading(true);
      const cagesCollection = collection(db, "cages");
      const cagesSnapshot = await getDocs(cagesCollection);
      const cagesData = cagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedCages = initialCages.map((cage) => {
        const foundCage = cagesData.find((c) => c.id === cage.id);
        return foundCage ? foundCage : cage;
      });

      setCages(updatedCages);
    } catch (err) {
      setError("Failed to fetch cages data.");
      console.error("Error fetching cages:", err);
    } finally {
      setLoading(false);
    }
  }, [initialCages]);

  useEffect(() => {
    fetchCages();
  }, [fetchCages]);

  const saveCage = async (cage) => {
    const cageDoc = doc(db, "cages", cage.id);
    await setDoc(cageDoc, cage);
  };

  const deleteCage = async (cageId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmation) {
      try {
        const petCageDoc = doc(db, "cages", cageId);
        const feedingInfoCollection = collection(
          db,
          `pets/${
            cages.find((cage) => cage.id === cageId).pet.id
          }/feedingInformations`
        );

        const batch = writeBatch(db);
        const petFeedingScheduleRTD = ref(
          realtimeDatabase,
          `petFeedingSchedule/${
            cages.find((cage) => cage.id === cageId).pet.id
          }`
        );

        await deleteDoc(petCageDoc);

        const feedingInfoSnapshot = await getDocs(feedingInfoCollection);
        feedingInfoSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

        await batch.commit();
        await remove(petFeedingScheduleRTD);
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
      const newCages = cages.map((cage) =>
        cage.id === cageId ? { ...cage, pet: null } : cage
      );
      setCages(newCages);
    }
  };

  const openModal = (index) => {
    setSelectedCageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCageIndex(null);
    setModalIsOpen(false);
  };

  const fetchWeight = async (pet, cageId) => {
    setCageFetchingWeight((prev) => ({ ...prev, [cageId]: true }));

    const triggerRef = ref(realtimeDatabase, "trigger/getPetWeight");
    const weightRef = ref(realtimeDatabase, "getWeight/loadCell/weight");

    try {
      await set(triggerRef, { status: true });

      onValue(triggerRef, async (snapshot) => {
        const triggerStatus = snapshot.val();
        if (triggerStatus && triggerStatus.status === false) {
          onValue(weightRef, async (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
              const weight = Number(data);
              setCageWeights((prev) => ({ ...prev, [cageId]: weight }));

              try {
                const petDocRef = doc(db, `pets/${pet.id}`);
                await updateDoc(petDocRef, { weight });
                console.log(`Updated pet ${pet.name} with weight: ${weight}`);
              } catch (error) {
                console.error("Error updating pet weight in Firestore:", error);
              } finally {
                setCageFetchingWeight((prev) => ({
                  ...prev,
                  [cageId]: false,
                }));

                setTimeout(() => {
                  setCageWeights((prev) => ({ ...prev, [cageId]: null }));
                }, 5000);
              }
            }
          });
        }
      });
    } catch (error) {
      console.error("Error setting trigger for weight fetch:", error);
      setCageFetchingWeight((prev) => ({
        ...prev,
        [cageId]: false,
      }));
    }
  };

  const addPetToCage = async (pet) => {
    if (selectedCageIndex !== null) {
      const newCages = [...cages];
      newCages[selectedCageIndex].pet = pet;
      setCages(newCages);
      await saveCage(newCages[selectedCageIndex]);
      await fetchWeight(pet, newCages[selectedCageIndex].id);
      closeModal();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderFeedingInfo = (cage) => {
    const feedingInfo = latestFeedingInfo[cage.pet?.id];
    return feedingInfo ? (
      <div>
        <p className="text-gray-600 mt-2 font-semibold">
          Feeding Type:{" "}
          <span className="text-darkViolet">
            {feedingInfo.feedingMode ? feedingInfo.feedingMode : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Resting Energy Requirement (RER):{" "}
          <span className="text-darkViolet">
            {feedingInfo.RER
              ? `${Number(feedingInfo.RER).toFixed(2)} kcal/day`
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Maintenance Energy Requirement (MER):{" "}
          <span className="text-darkViolet">
            {feedingInfo.MER
              ? `${Number(feedingInfo.MER).toFixed(2)} kcal/day`
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Date Started Feeding:{" "}
          <span className="text-darkViolet">
            {feedingInfo.createdAt &&
            typeof feedingInfo.createdAt.toDate === "function"
              ? feedingInfo.createdAt.toDate().toLocaleDateString(undefined, {
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
        <p className="text-gray-600 mt-2 font-semibold">
          Selected Food:{" "}
          <span className="text-darkViolet">
            {feedingInfo.foodSelectedName
              ? feedingInfo.foodSelectedName
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Food{"'"}s Calories Per Gram:{" "}
          <span className="text-darkViolet">
            {feedingInfo.caloriesPerGram
              ? `${feedingInfo.caloriesPerGram} kcal/g`
              : "N/A"}
          </span>
        </p>
      </div>
    ) : (
      <p>No feeding information available</p>
    );
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full gap-4">
        {cages.map((cage, index) => {
          const pet = cage.pet;

          return (
            <div
              key={cage.id}
              className="border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 hover:shadow-xl transition-shadow duration-200 relative"
            >
              <div className="absolute top-0 left-0 m-2 text-gray-400">
                {cage.id}
              </div>
              {pet ? (
                <div className="text-center flex">
                  <div className="flex items-center justify-center">
                    <span className="text-gray-500 italic mb-2">
                      {cageFetchingWeight[cage.id]
                        ? "Fetching weight..."
                        : cageWeights[cage.id] !== undefined &&
                          cageWeights[cage.id] !== null
                        ? `Weight: ${cageWeights[cage.id]} kg`
                        : ""}
                    </span>
                  </div>
                  <div className="mt-2 p-2 border-t border-gray-200 w-fit">
                    <div className="flex items-center justify-center">
                      <img
                        src={pet.imageURL}
                        className="w-16 h-16 object-cover rounded-full m-2"
                        alt="pet's image in cage system"
                      />
                      <h2 className="font-bold text-darkViolet m-2">
                        {pet.name}
                      </h2>
                    </div>
                    <FeedAmountComponent
                      petId={pet.id}
                      petName={pet.name}
                      petType={pet.petType}
                      weight={cageWeights[cage.id] || Number(pet.weight)}
                      activityLevel={Number(pet.activityLevel)}
                      latestFeedingInfo={petRecords[pet.name]?.[0] || {}}
                      cageID={cage.id}
                      closeModal={closeModal}
                    />
                    {renderFeedingInfo(cage)}
                  </div>
                  <button
                    className="absolute top-0 right-0 m-2 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors duration-200 h-fit w-fit"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCage(cage.id);
                    }}
                  >
                    <div className="relative bg-mainColor hover:bg-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                      <TiDelete className="size-6" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FaPlus
                    size={24}
                    onClick={() => openModal(index)}
                    className="border border-black rounded-full cursor-pointer"
                  />
                  <p className="text-gray-500 mt-2">Click to add a pet</p>
                  <span className="text-gray-500 mt-1 font-extralight italic">
                    Automatically triggers fetching weight
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select a Pet"
        className="bg-white rounded-lg p-4 max-w-md mx-auto mt-20 border border-gray-300 shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4">Select a Pet</h2>
        <ul className="grid grid-cols-3">
          {petList.map((pet) => (
            <li
              key={pet.id}
              onClick={() => addPetToCage(pet)}
              className="p-2 m-2 border border-gray-200 rounded mb-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              {pet.name}
            </li>
          ))}
          <button
            onClick={closeModal}
            className="m-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Cancel
          </button>
        </ul>
      </Modal>
    </div>
  );
}
