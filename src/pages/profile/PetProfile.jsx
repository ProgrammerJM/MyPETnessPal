import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../../config/firebase";
import { IoAddCircle } from "react-icons/io5";
import {
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, remove } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import PropTypes from "prop-types";
import PetList from "./PetList";
import AddPetModal from "./AddPetModal";

export default function PetProfile({ petFoodList, onPetListChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petList, setPetList] = useState([]);
  const [smartFeedingActivated, setSmartFeedingActivated] = useState(false);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  const getPetList = useCallback(() => {
    const inOrderPetList = query(petCollectionRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(
      inOrderPetList,
      (snapshot) => {
        const updatedPetList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        onPetListChange(updatedPetList);
        setPetList(updatedPetList);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, [petCollectionRef, onPetListChange]);

  useEffect(() => {
    const unsubscribe = getPetList();
    return () => unsubscribe();
  }, [getPetList]);

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

  const deletePet = useCallback(async (id) => {
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
  }, []);

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
        petFoodList={petFoodList}
      />

      <AddPetModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        getPetList={getPetList}
        petCollectionRef={petCollectionRef}
      />
    </>
  );
}

PetProfile.propTypes = {
  petFoodList: PropTypes.array.isRequired,
  onPetListChange: PropTypes.func.isRequired,
};
