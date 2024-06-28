import { useEffect, useState, useMemo, useCallback } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function FetchPets(onPetListChange) {
  const [petList, setPetList] = useState([]);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  console.log(petList);

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

  return petList;
}
