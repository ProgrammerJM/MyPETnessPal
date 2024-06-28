import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const PetRecords = async (petName) => {
  const records = [];
  try {
    const querySnapshot = await getDocs(
      collection(db, `pets/${petName}/records`)
    );
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching pet records:", error);
    throw error; // Propagate the error to be handled by the caller
  }
  return records;
};

export default PetRecords;
