import { useEffect, useState, useMemo } from "react";
import { db } from "../../config/firebase";
import { IoAddCircle } from "react-icons/io5";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";
import PropTypes from "prop-types"; // Import PropTypes
import PetList from "./PetList";
import AddPetModal from "./AddPetModal";

export default function PetProfile({ petFoodList, onPetListChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petList, setPetList] = useState([]);
  const [smartFeedingActivated, setSmartFeedingActivated] = useState(false);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  const getPetList = async () => {
    try {
      const inOrderPetList = query(petCollectionRef, orderBy("createdAt"));
      const data = await getDocs(inOrderPetList);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      onPetListChange(filteredData); // Pass the petList to the parent App component
      setPetList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPetList();
  }, []);

  useEffect(() => {
    const savedSmartFeedingState = localStorage.getItem(
      "smartFeedingActivated"
    );
    if (savedSmartFeedingState !== null) {
      setSmartFeedingActivated(JSON.parse(savedSmartFeedingState));
    }
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const deletePet = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmation) {
      const petDocument = doc(db, "pets", id);
      await deleteDoc(petDocument);
      getPetList(); // Refresh the pet list after deletion
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

// Add prop validation for petFoodList
PetProfile.propTypes = {
  petFoodList: PropTypes.array.isRequired,
  onPetListChange: PropTypes.func.isRequired,
};
