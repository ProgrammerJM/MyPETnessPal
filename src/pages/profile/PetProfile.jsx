import { useEffect, useState, useMemo } from "react";
import { db } from "../../config/firebase";
import { IoAddCircle } from "react-icons/io5";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types"; // Import PropTypes
import PetList from "./PetList";
import AddPetModal from "./AddPetModal";

export default function PetProfile({ petFoodList }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petList, setPetList] = useState([]);
  const [smartFeedingActivated, setSmartFeedingActivated] = useState(false);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  const getPetList = async () => {
    try {
      const data = await getDocs(petCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
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
    alert("Are you sure you want to delete this pet?");
    const petDocument = doc(db, "pets", id);
    await deleteDoc(petDocument);
    getPetList(); // Refresh the pet list after deletion
  };

  return (
    <div>
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
    </div>
  );
}

// Add prop validation for petFoodList
PetProfile.propTypes = {
  petFoodList: PropTypes.array.isRequired,
};
