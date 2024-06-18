// import { useEffect, useState } from "react";
// import { ref, onValue, set } from "firebase/database";
// import { realtimeDatabase } from "../../config/firebase";

// export const FetchWeight = async () => {
//   const [weightLoading, setWeightLoading] = useState(false);
//   const [currentWeight, setCurrentWeight] = useState(null);

//   setWeightLoading(true);
//   const triggerRef = ref(realtimeDatabase, "trigger/getPetWeight");
//   await set(triggerRef, { status: true });

//   const weightRef = ref(realtimeDatabase, "getWeight/loadCell/weight");
//   onValue(weightRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data !== null) {
//       setCurrentWeight(Number(data));
//       setWeightLoading(false);
//     }
//   });
// };

// useEffect(() => {
//   if (selectedCageIndex !== null) {
//     FetchWeight();
//   }
// }, [selectedCageIndex]);
