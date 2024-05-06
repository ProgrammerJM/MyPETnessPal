import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import PropTypes from "prop-types";

export default function GetWeight({ setPetWeight }) {
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState(null);

  const handleClick = async () => {
    setLoading(true);

    // Update Firestore document to trigger ESP32 to send weight data
    const triggerDocRef = doc(db, "trigger", "getPetWeight");
    await setDoc(triggerDocRef, { status: true });
  };

  useEffect(() => {
    const weightDocRef = doc(db, "getWeight", "LoadCell");

    const unsubscribe = onSnapshot(weightDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPetWeight(Number(data.Weight));
        setWeight(Number(data.Weight)); // Convert the weight to a number here
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setPetWeight]);

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className="border p-2">
        {loading ? "Fetching Weight..." : "Get Weight"}
      </button>
      {weight !== null && <p>Current Weight: {weight} grams</p>}
    </div>
  );
}

GetWeight.propTypes = {
  setPetWeight: PropTypes.func.isRequired,
};
