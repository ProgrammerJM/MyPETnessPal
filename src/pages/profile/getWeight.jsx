// import { useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import PropTypes from "prop-types";

// const WeightComponent = ({ setPetWeight }) => {
//   const [loading, setLoading] = useState(false);
//   const [weight, setWeight] = useState(null);

//   const fetchWeight = async () => {
//     setLoading(true);
//     try {
//       const weightDocRef = doc(db, "getWeight", "LoadCell");
//       const weightDocSnap = await getDoc(weightDocRef);

//       if (weightDocSnap.exists()) {
//         const data = weightDocSnap.data();
//         setPetWeight(data.Weight);
//         setWeight(data.Weight); // Set weight value for display
//       } else {
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.error("Error getting document:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchWeight} disabled={loading} className="border p-2">
//         {loading ? "Fetching Weight..." : "Get Weight"}
//       </button>
//       {weight !== null && <p>Current Weight: {weight} kg</p>}
//     </div>
//   );
// };

// WeightComponent.propTypes = {
//   setPetWeight: PropTypes.func.isRequired,
// };

// export default WeightComponent;
import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import PropTypes from "prop-types";

const WeightComponent = ({ setPetWeight }) => {
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
        setPetWeight(data.Weight);
        setWeight(data.Weight);
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
      {weight !== null && <p>Current Weight: {weight} kg</p>}
    </div>
  );
};

WeightComponent.propTypes = {
  setPetWeight: PropTypes.func.isRequired,
};

export default WeightComponent;
