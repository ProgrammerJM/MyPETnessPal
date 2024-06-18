import { useState, useEffect, useContext } from "react";
import { db } from "../../config/firebase";
import { IoAddCircle } from "react-icons/io5";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, remove } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import { PetContext } from "../function/PetContext";
import PetList from "./PetList";
import AddPetModal from "./AddPetModal";

export default function PetProfile() {
  const { petList } = useContext(PetContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smartFeedingActivated, setSmartFeedingActivated] = useState(false);

  useEffect(() => {
    const savedSmartFeedingState = localStorage.getItem(
      "smartFeedingActivated"
    );
    if (savedSmartFeedingState !== null) {
      setSmartFeedingActivated(JSON.parse(savedSmartFeedingState));
    }
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const deletePet = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmation) {
      try {
        const petDocument = doc(db, "pets", id);
        const petFeedingSchedule = ref(
          realtimeDatabase,
          `petFeedingSchedule/${id}`
        );
        await deleteDoc(petDocument);
        await remove(petFeedingSchedule);
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    }
  };

  return (
    <>
      <button
        className="text-white inline-flex items-center justify-center gap-2.5 rounded-md bg-darkViolet py-3 px-6
        text-center font-medium hover:bg-opacity-90 mb-4"
        onClick={toggleModal}
      >
        <IoAddCircle className="size-7" />
        Add Pet
      </button>

      <PetList
        petList={petList}
        deletePet={deletePet}
        smartFeedingActivated={smartFeedingActivated}
      />

      <AddPetModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
    </>
  );
}
