import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import PropTypes from "prop-types";
import PetRecords from "./PetRecords"; // Adjust the path if necessary

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [petList, setPetList] = useState([]);
  const [petFoodList, setPetFoodList] = useState([]);
  const [petRecords, setPetRecords] = useState({});
  const [feedingInformationRecords, setFeedingInformationRecords] = useState(
    {}
  );
  const [latestFeedingInfo, setLatestFeedingInfo] = useState({});

  // Memoize the collection references
  const petCollectionRef = useMemo(() => collection(db, "pets"), []);
  const petFoodCollectionRef = useMemo(() => collection(db, "petFoodList"), []);

  useEffect(() => {
    if (petList.length === 0) return;

    const unsubscribeFeedingInfoListeners = [];

    petList.forEach((pet) => {
      const feedingInformationsCollection = collection(
        db,
        `pets/${pet.id}/feedingInformations`
      );

      const unsubscribe = onSnapshot(
        feedingInformationsCollection,
        (snapshot) => {
          const petFeedingInformations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setFeedingInformationRecords((prev) => ({
            ...prev,
            [pet.id]: petFeedingInformations,
          }));

          const latestInfo = petFeedingInformations.reduce((latest, info) => {
            return info.timestamp > latest.timestamp ? info : latest;
          }, petFeedingInformations[0] || {});

          setLatestFeedingInfo((prev) => ({
            ...prev,
            [pet.id]: latestInfo,
          }));
        }
      );

      unsubscribeFeedingInfoListeners.push(unsubscribe);
    });

    return () => {
      unsubscribeFeedingInfoListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [petList]);

  useEffect(() => {
    const unsubscribe = onSnapshot(petFoodCollectionRef, (snapshot) => {
      const petFoodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPetFoodList(petFoodData);
    });

    return () => unsubscribe();
  }, [petFoodCollectionRef]);

  const getPetList = useCallback(() => {
    const inOrderPetList = query(petCollectionRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(
      inOrderPetList,
      (snapshot) => {
        const updatedPetList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPetList(updatedPetList);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, [petCollectionRef]);

  const fetchPetRecords = useCallback(async () => {
    if (petList.length === 0) return;

    try {
      const records = {};
      for (const pet of petList) {
        const petName = pet.name;
        const petRecordsData = await PetRecords(petName);
        records[petName] = petRecordsData;
      }
      setPetRecords(records);
    } catch (error) {
      console.error("Error fetching pet records:", error);
    }
  }, [petList]);

  useEffect(() => {
    const unsubscribe = getPetList();
    return () => unsubscribe();
  }, [getPetList]);

  useEffect(() => {
    fetchPetRecords();
  }, [petList, fetchPetRecords]);

  return (
    <PetContext.Provider
      value={{
        petList,
        setPetList,
        petFoodList,
        setPetFoodList,
        latestFeedingInfo,
        petRecords,
        feedingInformationRecords,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

PetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
