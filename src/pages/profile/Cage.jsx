import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import FeedAmountComponent from "./feedAmountComponent";
import { PetContext } from "../../pages/function/PetContext";
import { ref, onValue, set, remove } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import { db } from "../../config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

Modal.setAppElement("#root");

export default function Cage() {
  const { petList, petRecords } = useContext(PetContext);

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

  return (
    <div className="p-4">
      <div className="grid grid-row-1 sm:grid-row-2 md:grid-row-3 lg:grid-row-4 gap-4">
        {cages.map((cage, index) => (
          <div
            key={cage.id}
            className="border-2 border-gray-300 flex flex-col items-center justify-center p-4"
          >
            {cage.pet ? (
              <div className="text-center">
                <div className="flex item-center justify-center">
                  <span className="border-re">
                    {cageFetchingWeight[cage.id]
                      ? "Fetching weight"
                      : cageWeights[cage.id] !== undefined &&
                        cageWeights[cage.id] !== null
                      ? `Successfully fetched weight: ${
                          cageWeights[cage.id]
                        } kg`
                      : ""}
                  </span>
                  <img
                    src={cage.pet.imageURL}
                    className="w-20 h-20 object-cover rounded-full"
                    alt="pet's image in cage system"
                  />
                  <h2 className="text-lg font-bold">{cage.pet.name}</h2>
                </div>
                <div className="mt-2 p-2 border-t border-gray-200 w-full">
                  <FeedAmountComponent
                    petId={cage.pet.id}
                    petName={cage.pet.name}
                    petType={cage.pet.petType}
                    weight={cageWeights[cage.id] || Number(cage.pet.weight)}
                    activityLevel={Number(cage.pet.activityLevel)}
                    latestFeedingInfo={petRecords[cage.pet.name]?.[0] || {}}
                    cageID={cage.id}
                    closeModal={closeModal}
                  />
                </div>
                <p className="text-gray-400 mt-1">{cage.id}</p>
                <button
                  className="mt-2 p-2 bg-red-500 text-white rounded flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCage(cage.id);
                  }}
                >
                  <FaTrash className="mr-2" /> Delete Pet
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
                  Automatically triggers fetching weight upon adding a pet
                </span>
                <p className="text-gray-400 mt-1">{cage.id}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            height: "auto",
          },
        }}
      >
        <h2>Select a Pet to Add</h2>
        <ul className="p-4">
          {petList.map((pet) => (
            <li
              key={pet.id}
              onClick={() => addPetToCage(pet)}
              className="cursor-pointer hover p-2"
            >
              {pet.name}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={closeModal}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}
