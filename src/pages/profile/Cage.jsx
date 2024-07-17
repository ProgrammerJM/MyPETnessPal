// import { useState, useEffect, useContext, useCallback, useMemo } from "react";
// import { FaPlus } from "react-icons/fa";
// import Modal from "react-modal";
// import FeedAmountComponent from "./feedAmountComponent";
// import { PetContext } from "../../pages/function/PetContext";
// import { ref, onValue, set, remove } from "firebase/database";
// import { realtimeDatabase, db } from "../../config/firebase";
// import {
//   collection,
//   doc,
//   getDocs,
//   setDoc,
//   deleteDoc,
//   updateDoc,
//   writeBatch,
// } from "firebase/firestore";
// import { TiDelete } from "react-icons/ti";

// Modal.setAppElement("#root");

// export default function Cage() {
//   const { petList, petRecords, latestFeedingInfo } = useContext(PetContext);

//   const initialCages = useMemo(
//     () => [
//       { id: "cage_01", pet: null },
//       { id: "cage_02", pet: null },
//       { id: "cage_03", pet: null },
//       { id: "cage_04", pet: null },
//     ],
//     []
//   );

//   const [cages, setCages] = useState(initialCages);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedCageIndex, setSelectedCageIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cageFetchingWeight, setCageFetchingWeight] = useState({});
//   const [cageWeights, setCageWeights] = useState({});

//   const fetchCages = useCallback(async () => {
//     try {
//       setLoading(true);
//       const cagesCollection = collection(db, "cages");
//       const cagesSnapshot = await getDocs(cagesCollection);
//       const cagesData = cagesSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const updatedCages = initialCages.map((cage) => {
//         const foundCage = cagesData.find((c) => c.id === cage.id);
//         return foundCage ? foundCage : cage;
//       });

//       setCages(updatedCages);
//     } catch (err) {
//       setError("Failed to fetch cages data.");
//       console.error("Error fetching cages:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [initialCages]);

//   useEffect(() => {
//     fetchCages();
//   }, [fetchCages]);

//   const saveCage = async (cage) => {
//     const cageDoc = doc(db, "cages", cage.id);
//     await setDoc(cageDoc, cage);
//   };

//   const deleteCage = async (cageId) => {
//     const confirmation = window.confirm(
//       "Are you sure you want to delete this pet?"
//     );
//     if (confirmation) {
//       try {
//         const petCageDoc = doc(db, "cages", cageId);
//         // const feedingInfoCollection = collection(
//         //   db,
//         //   `pets/${
//         //     cages.find((cage) => cage.id === cageId).pet.id
//         //   }/feedingInformations`
//         // );

//         const batch = writeBatch(db);
//         const petFeedingScheduleRTD = ref(
//           realtimeDatabase,
//           `petFeedingSchedule/${
//             cages.find((cage) => cage.id === cageId).pet.id
//           }`
//         );

//         await deleteDoc(petCageDoc);

//         // const feedingInfoSnapshot = await getDocs(feedingInfoCollection);
//         // feedingInfoSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

//         await batch.commit();
//         await remove(petFeedingScheduleRTD);
//       } catch (error) {
//         console.error("Error deleting pet:", error);
//       }
//       const newCages = cages.map((cage) =>
//         cage.id === cageId ? { ...cage, pet: null } : cage
//       );
//       setCages(newCages);
//     }
//   };

//   const openModal = (index) => {
//     setSelectedCageIndex(index);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedCageIndex(null);
//     setModalIsOpen(false);
//   };

//   const fetchWeight = async (pet, cageId) => {
//     setCageFetchingWeight((prev) => ({ ...prev, [cageId]: true }));

//     const triggerRef = ref(realtimeDatabase, "trigger/getPetWeight");
//     const weightRef = ref(realtimeDatabase, "getWeight/loadCell/weight");

//     try {
//       await set(triggerRef, { status: true });

//       onValue(triggerRef, async (snapshot) => {
//         const triggerStatus = snapshot.val();
//         if (triggerStatus && triggerStatus.status === false) {
//           onValue(weightRef, async (snapshot) => {
//             const data = snapshot.val();
//             if (data !== null) {
//               const weight = Number(data);
//               setCageWeights((prev) => ({ ...prev, [cageId]: weight }));

//               try {
//                 const petDocRef = doc(db, `pets/${pet.id}`);
//                 await updateDoc(petDocRef, { weight });
//                 console.log(`Updated pet ${pet.name} with weight: ${weight}`);
//               } catch (error) {
//                 console.error("Error updating pet weight in Firestore:", error);
//               } finally {
//                 setCageFetchingWeight((prev) => ({
//                   ...prev,
//                   [cageId]: false,
//                 }));
//               }
//             }
//           });
//         }
//       });
//     } catch (error) {
//       console.error("Error setting trigger for weight fetch:", error);
//       setCageFetchingWeight((prev) => ({
//         ...prev,
//         [cageId]: false,
//       }));
//     }
//   };

//   const addPetToCage = async (pet) => {
//     if (selectedCageIndex !== null) {
//       const newCages = [...cages];
//       newCages[selectedCageIndex].pet = pet;
//       setCages(newCages);
//       await saveCage(newCages[selectedCageIndex]);
//       await fetchWeight(pet, newCages[selectedCageIndex].id);
//       closeModal();
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   const renderFeedingInfo = (cage) => {
//     const feedingInfo = latestFeedingInfo[cage.pet?.id];
//     return feedingInfo ? (
//       <div className="text-center text-wrap whitespace-break-spaces text-clip">
//         <p className="text-light-darkViolet mt-2 font-bold ">
//           Latest Feeding Information:
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Feeding Type:{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.feedingMode ? feedingInfo.feedingMode : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Resting Energy Requirement (RER):{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.RER
//               ? `${Number(feedingInfo.RER).toFixed(2)} kcal/day`
//               : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Maintenance Energy Requirement (MER):{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.MER
//               ? `${Number(feedingInfo.MER).toFixed(2)} kcal/day`
//               : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Date Started Feeding:{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.createdAt &&
//             typeof feedingInfo.createdAt.toDate === "function"
//               ? feedingInfo.createdAt.toDate().toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: true,
//                 })
//               : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Selected Food:{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.foodSelectedName
//               ? feedingInfo.foodSelectedName
//               : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Food{"'"}s Calories Per Gram:{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.caloriesPerGram
//               ? `${feedingInfo.caloriesPerGram} Calories/g`
//               : "N/A"}
//           </span>
//         </p>
//         <p className="text-gray-600 mt-2 font-semibold">
//           Amount To Feed:{" "}
//           <span className="text-light-darkViolet">
//             {feedingInfo.amountToFeed ? `${feedingInfo.amountToFeed}g` : "N/A"}
//           </span>
//         </p>
//       </div>
//     ) : (
//       <p>No feeding information available</p>
//     );
//   };

//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full gap-4">
//         {cages.map((cage, index) => {
//           const pet = cage.pet;

//           return (
//             <div
//               key={cage.id}
//               className="border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 hover:shadow-xl transition-shadow duration-200 relative"
//             >
//               <div className="absolute top-0 left-0 m-2 text-gray-400">
//                 {cage.id}
//               </div>
//               {pet ? (
//                 <div className="text-center flex">
//                   <div className="mt-2 p-2 border-t border-gray-200 w-fit">
//                     <div className="flex items-center justify-center">
//                       <span className="text-gray-500 italic mb-2">
//                         {cageFetchingWeight[cage.id]
//                           ? "Fetching weight..."
//                           : cageWeights[cage.id] !== undefined
//                           ? cageWeights[cage.id] !== null
//                             ? `Weight: ${cageWeights[cage.id]} kg`
//                             : "Weight: N/A"
//                           : "Weight: N/A"}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-center">
//                       <img
//                         src={pet.imageURL}
//                         className="w-24 h-24 object-cover rounded-3xl m-2"
//                         alt="pet's image in cage system"
//                       />
//                       <h2 className="font-bold text-light-darkViolet m-2">
//                         {pet.name}
//                       </h2>
//                     </div>
//                     {/* Render FeedAmountComponent only when cageWeights[cage.id] is defined and not null */}
//                     {cageWeights[cage.id] !== undefined &&
//                       cageWeights[cage.id] !== null && (
//                         <FeedAmountComponent
//                           petId={pet.id}
//                           petName={pet.name}
//                           petType={pet.petType}
//                           weight={cageWeights[cage.id]}
//                           activityLevel={Number(pet.activityLevel)}
//                           latestFeedingInfo={petRecords[pet.name]?.[0] || {}}
//                           cageID={cage.id}
//                           closeModal={closeModal}
//                         />
//                       )}
//                     {renderFeedingInfo(cage)}
//                   </div>
//                   <button
//                     className="absolute top-0 right-0 m-2 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors duration-200 h-fit w-fit"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteCage(cage.id);
//                     }}
//                   >
//                     <div className="relative bg-light-mainColor hover:bg-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
//                       <TiDelete className="size-6" />
//                     </div>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center">
//                   <FaPlus
//                     size={24}
//                     onClick={() => openModal(index)}
//                     className="border border-black rounded-full cursor-pointer"
//                   />
//                   <p className="text-gray-500 mt-2">Click to add a pet</p>
//                   <span className="text-gray-500 mt-1 font-extralight italic">
//                     Automatically triggers fetching weight
//                   </span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Select a Pet"
//         className="bg-white rounded-lg p-4 max-w-md mx-auto mt-20 border border-gray-300 shadow-lg"
//       >
//         <h2 className="text-lg font-bold mb-4">Select a Pet</h2>
//         <ul className="grid grid-cols-3">
//           {petList.map((pet) => (
//             <li
//               key={pet.id}
//               onClick={() => addPetToCage(pet)}
//               className="p-2 m-2 border border-gray-200 rounded mb-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
//             >
//               {pet.name}
//             </li>
//           ))}
//           <button
//             onClick={closeModal}
//             className="m-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
//           >
//             Cancel
//           </button>
//         </ul>
//       </Modal>
//     </div>
//   );
// }
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import FeedAmountComponent from "./feedAmountComponent";
import { PetContext } from "../../pages/function/PetContext";
import { ref, onValue, set, remove, off, get } from "firebase/database";
import { realtimeDatabase, db } from "../../config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  getDoc,
} from "firebase/firestore";
import { TiDelete } from "react-icons/ti";
import { LuView } from "react-icons/lu";

Modal.setAppElement("#root");

export default function Cage() {
  const navigate = useNavigate();
  const { petList, petRecords, latestFeedingInfo } = useContext(PetContext);

  const initialCages = useMemo(
    () => [
      { id: "cage_01", pet: null },
      { id: "cage_02", pet: null },
      { id: "cage_03", pet: null },
      { id: "cage_04", pet: null },
    ],
    []
  );

  const [cages, setCages] = useState(initialCages);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCageIndex, setSelectedCageIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cageFetchingWeight, setCageFetchingWeight] = useState({});
  const [cageWeights, setCageWeights] = useState({});
  const [weightNotification, setWeightNotification] = useState({});

  const fetchCages = useCallback(async () => {
    try {
      setLoading(true);
      const cagesCollection = collection(db, "cages");
      const cagesSnapshot = await getDocs(cagesCollection);
      const cagesData = cagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedCages = initialCages.map((cage) => {
        const foundCage = cagesData.find((c) => c.id === cage.id);
        return foundCage ? foundCage : cage;
      });

      setCages(updatedCages);

      const weights = cagesData.reduce((acc, cage) => {
        if (cage.weight !== undefined) {
          acc[cage.id] = cage.weight;
        }
        return acc;
      }, {});
      setCageWeights(weights);
    } catch (err) {
      setError("Failed to fetch cages data.");
      console.error("Error fetching cages:", err);
    } finally {
      setLoading(false);
    }
  }, [initialCages]);

  useEffect(() => {
    fetchCages();
  }, [fetchCages]);

  const saveCage = async (cage) => {
    const cageDoc = doc(db, "cages", cage.id);
    await setDoc(cageDoc, cage);
  };

  const deleteCage = async (cageId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmation) {
      try {
        const petCageDoc = doc(db, "cages", cageId);
        const batch = writeBatch(db);
        const petFeedingScheduleRTD = ref(
          realtimeDatabase,
          `petFeedingSchedule/${
            cages.find((cage) => cage.id === cageId).pet.id
          }`
        );

        await deleteDoc(petCageDoc);
        await batch.commit();
        await remove(petFeedingScheduleRTD);
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
      const newCages = cages.map((cage) =>
        cage.id === cageId ? { ...cage, pet: null } : cage
      );
      setCages(newCages);
    }
  };

  const openModal = (index) => {
    setSelectedCageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCageIndex(null);
    setModalIsOpen(false);
  };

  // const fetchWeight = async (pet, cageId) => {
  //   setCageFetchingWeight((prev) => ({ ...prev, [cageId]: true }));

  //   const triggerRef = ref(realtimeDatabase, "trigger/getPetWeight");
  //   const weightRef = ref(realtimeDatabase, "getWeight/loadCell/weight");

  //   try {
  //     await set(triggerRef, { status: true });

  //     onValue(triggerRef, async (snapshot) => {
  //       const triggerStatus = snapshot.val();
  //       if (triggerStatus && triggerStatus.status === false) {
  //         onValue(weightRef, async (snapshot) => {
  //           const data = snapshot.val();
  //           if (data !== null) {
  //             const weight = Number(data);
  //             setCageWeights((prev) => ({ ...prev, [cageId]: weight }));
  //             // setCageWeights((prev) => {
  //             //   const updatedWeights = { ...prev, [cageId]: weight };
  //             //   localStorage.setItem(
  //             //     "cageWeights",
  //             //     JSON.stringify(updatedWeights)
  //             //   );
  //             //   return updatedWeights;
  //             // });
  //             setWeightNotification((prev) => ({ ...prev, [cageId]: true }));

  //             setTimeout(() => {
  //               setWeightNotification((prev) => ({ ...prev, [cageId]: false }));
  //             }, 5000);

  //             try {
  //               const petDocRef = doc(db, `pets/${pet.id}`);
  //               await updateDoc(petDocRef, { weight });
  //               console.log(`Updated pet ${pet.name} with weight: ${weight}`);

  //               const cageDocRef = doc(db, `cages/${cageId}`);
  //               await updateDoc(cageDocRef, { weight });
  //               console.log(`Updated cage ${cageId} with weight: ${weight}`);
  //             } catch (error) {
  //               console.error(
  //                 "Error updating pet or cage weight in Firestore:",
  //                 error
  //               );
  //             } finally {
  //               setCageFetchingWeight((prev) => ({
  //                 ...prev,
  //                 [cageId]: false,
  //               }));
  //             }
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error setting trigger for weight fetch:", error);
  //     setCageFetchingWeight((prev) => ({
  //       ...prev,
  //       [cageId]: false,
  //     }));
  //   }
  // };
  const fetchWeight = useCallback(async (pet, cageId) => {
    console.log(`Fetching weight for cage ${cageId}`);

    setCageFetchingWeight((prev) => ({ ...prev, [cageId]: true }));

    const triggerRef = ref(realtimeDatabase, `trigger/getPetWeight/status`);
    const weightRef = ref(realtimeDatabase, `getWeight/loadCell/weight`);

    try {
      await set(triggerRef, true); // Set trigger status to true
      console.log(`Trigger set for cage ${cageId}`);

      const triggerListener = onValue(triggerRef, async (triggerSnapshot) => {
        const triggerStatus = triggerSnapshot.val();
        console.log(`Trigger status for cage ${cageId}:`, triggerStatus);

        if (triggerStatus === false) {
          // Check if the trigger status is false
          console.log(
            `Trigger status is false for cage ${cageId}, proceeding to fetch weight.`
          );

          // Adding a slight delay
          setTimeout(async () => {
            const weightSnapshot = await get(weightRef);
            const data = weightSnapshot.val();
            console.log(`Weight data for cage ${cageId}:`, data);

            if (data !== null) {
              const weight = Number(data);
              setCageWeights((prev) => ({ ...prev, [cageId]: weight }));
              setWeightNotification((prev) => ({ ...prev, [cageId]: true }));

              setTimeout(() => {
                setWeightNotification((prev) => ({ ...prev, [cageId]: false }));
              }, 5000);

              try {
                const petDocRef = doc(db, `pets/${pet.id}`);
                await updateDoc(petDocRef, { weight });
                console.log(`Updated pet ${pet.name} with weight: ${weight}`);

                const cageDocRef = doc(db, `cages/${cageId}`);
                const cageDocSnapshot = await getDoc(cageDocRef);
                if (cageDocSnapshot.exists()) {
                  await updateDoc(cageDocRef, { weight });
                  console.log(`Updated cage ${cageId} with weight: ${weight}`);
                } else {
                  await setDoc(cageDocRef, { weight });
                  console.log(`Created cage ${cageId} with weight: ${weight}`);
                }
              } catch (error) {
                console.error(
                  "Error updating pet or cage weight in Firestore:",
                  error
                );
              } finally {
                setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
              }
            } else {
              console.log(`No weight data found for cage ${cageId}`);
              setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
            }
          }, 1000); // 1-second delay for testing

          off(triggerRef, triggerListener); // Detach the trigger listener
        }
      });
    } catch (error) {
      console.error("Error setting trigger for weight fetch:", error);
      setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
    }
  }, []);

  const addPetToCage = async (pet) => {
    if (selectedCageIndex !== null) {
      const newCages = [...cages];
      newCages[selectedCageIndex].pet = pet;
      setCages(newCages);
      await saveCage(newCages[selectedCageIndex]);
      await fetchWeight(pet, newCages[selectedCageIndex].id);
      closeModal();
    }
  };

  // const fetchWeight = useCallback(async (pet, cageId) => {
  //   console.log(`Fetching weight for cage ${cageId}`);

  //   setCageFetchingWeight((prev) => ({ ...prev, [cageId]: true }));

  //   const triggerRef = ref(realtimeDatabase, `trigger/getPetWeight/${cageId}`);
  //   const weightRef = ref(realtimeDatabase, `getWeight/loadCell/${cageId}`);

  //   try {
  //     await set(triggerRef, { status: true });
  //     console.log(`Trigger set for cage ${cageId}`);

  //     const triggerListener = onValue(triggerRef, async (triggerSnapshot) => {
  //       const triggerStatus = triggerSnapshot.val();
  //       console.log(`Trigger status for cage ${cageId}:`, triggerStatus);

  //       if (triggerStatus && triggerStatus.status === false) {
  //         console.log(
  //           `Trigger status is false for cage ${cageId}, proceeding to fetch weight.`
  //         );

  //         // Adding a slight delay
  //         setTimeout(async () => {
  //           const weightSnapshot = await get(weightRef);
  //           const data = weightSnapshot.val();
  //           console.log(`Weight data for cage ${cageId}:`, data);

  //           if (data !== null) {
  //             const weight = Number(data);
  //             setCageWeights((prev) => ({ ...prev, [cageId]: weight }));
  //             setWeightNotification((prev) => ({ ...prev, [cageId]: true }));

  //             setTimeout(() => {
  //               setWeightNotification((prev) => ({ ...prev, [cageId]: false }));
  //             }, 5000);

  //             try {
  //               const petDocRef = doc(db, `pets/${pet.id}`);
  //               await updateDoc(petDocRef, { weight });
  //               console.log(`Updated pet ${pet.name} with weight: ${weight}`);

  //               const cageDocRef = doc(db, `cages/${cageId}`);
  //               const cageDocSnapshot = await getDoc(cageDocRef);
  //               if (cageDocSnapshot.exists()) {
  //                 await updateDoc(cageDocRef, { weight });
  //                 console.log(`Updated cage ${cageId} with weight: ${weight}`);
  //               } else {
  //                 await setDoc(cageDocRef, { weight });
  //                 console.log(`Created cage ${cageId} with weight: ${weight}`);
  //               }
  //             } catch (error) {
  //               console.error(
  //                 "Error updating pet or cage weight in Firestore:",
  //                 error
  //               );
  //             } finally {
  //               setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
  //             }
  //           } else {
  //             console.log(`No weight data found for cage ${cageId}`);
  //             setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
  //           }
  //         }, 1000); // 1-second delay for testing

  //         off(triggerRef, triggerListener); // Detach the trigger listener
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error setting trigger for weight fetch:", error);
  //     setCageFetchingWeight((prev) => ({ ...prev, [cageId]: false }));
  //   }
  // }, []);

  // const addPetToCage = async (pet) => {
  //   if (selectedCageIndex !== null) {
  //     const newCages = [...cages];
  //     newCages[selectedCageIndex].pet = pet;
  //     setCages(newCages);
  //     await saveCage(newCages[selectedCageIndex]);
  //     await fetchWeight(pet, newCages[selectedCageIndex].id);
  //     closeModal();
  //   }
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderFeedingInfo = (cage) => {
    const feedingInfo = latestFeedingInfo[cage.pet?.id];
    return feedingInfo ? (
      <div className="text-center text-wrap whitespace-break-spaces text-clip">
        <p className="text-light-darkViolet mt-2 font-bold ">
          Latest Feeding Information:
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Feeding Mode:{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.feedingMode ? feedingInfo.feedingMode : "N/A"}
          </span>
        </p>
        {feedingInfo.feedingMode === "Smart" && (
          <p className="text-gray-600 mt-2 font-semibold">
            Servings:{" "}
            <span className="text-light-darkViolet">
              {feedingInfo.servings
                ? `${feedingInfo.servings} servings per day`
                : "N/A"}
            </span>
          </p>
        )}
        <p className="text-gray-600 mt-2 font-semibold">
          Resting Energy Requirement (RER):{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.RER
              ? `${Number(feedingInfo.RER).toFixed(2)} kcal/day`
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Maintenance Energy Requirement (MER):{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.MER
              ? `${Number(feedingInfo.MER).toFixed(2)} kcal/day`
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Date Started Feeding:{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.createdAt &&
            typeof feedingInfo.createdAt.toDate === "function"
              ? feedingInfo.createdAt.toDate().toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Selected Food:{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.foodSelectedName
              ? feedingInfo.foodSelectedName
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Food{"'"}s Calories Per Gram:{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.caloriesPerGram
              ? `${feedingInfo.caloriesPerGram} Calories/g`
              : "N/A"}
          </span>
        </p>
        <p className="text-gray-600 mt-2 font-semibold">
          Amount To Feed:{" "}
          <span className="text-light-darkViolet">
            {feedingInfo.amountToFeed
              ? `${Number(feedingInfo.amountToFeed).toFixed(2)}g`
              : "N/A"}
          </span>
        </p>
      </div>
    ) : (
      <p>No feeding information available</p>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-light-darkViolet">Cages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full gap-4">
        {cages.map((cage, index) => {
          const pet = cage.pet;

          return (
            <div
              key={cage.id}
              className="border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 hover:shadow-xl transition-shadow duration-200 relative"
            >
              <div className="absolute top-0 left-0 m-2 text-gray-400">
                {cage.id}
              </div>
              {pet ? (
                <div className="text-center flex">
                  <div className="mt-2 p-2 border-t border-gray-200 w-fit">
                    <div className="flex items-center justify-center">
                      <span className="text-gray-500 italic mb-2">
                        {cageFetchingWeight[cage.id]
                          ? "Fetching weight..."
                          : cageWeights[cage.id] !== undefined
                          ? cageWeights[cage.id] !== null &&
                            weightNotification[cage.id]
                            ? `Weight: ${cageWeights[cage.id]} kg`
                            : null
                          : "Weight: N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <img
                        src={pet.imageURL}
                        className="w-24 h-24 object-cover rounded-3xl m-2"
                        alt="pet's image in cage system"
                      />
                      <h2 className="font-bold text-light-darkViolet m-2">
                        {pet.name}
                      </h2>
                    </div>
                    {/* Render FeedAmountComponent only when cageWeights[cage.id] is defined and not null */}
                    {cageWeights[cage.id] !== undefined &&
                      cageWeights[cage.id] !== null && (
                        <FeedAmountComponent
                          petId={pet.id}
                          petName={pet.name}
                          petType={pet.petType}
                          weight={cageWeights[cage.id]}
                          activityLevel={Number(pet.activityLevel)}
                          latestFeedingInfo={petRecords[pet.name]?.[0] || {}}
                          cageID={cage.id}
                          closeModal={closeModal}
                        />
                      )}
                    {renderFeedingInfo(cage)}
                  </div>
                  <button
                    className="absolute top-0 right-0 m-2 text-white rounded flex items-center justify-center transition-colors duration-200 h-fit w-fit"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCage(cage.id);
                    }}
                  >
                    <div className="relative bg-light-mainColor hover:bg-light-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                      <TiDelete className="size-6" />
                    </div>
                  </button>
                  <button
                    className="absolute top-0 right-11 m-2 text-white rounded flex items-center justify-center transition-colors duration-200 h-fit w-fit"
                    onClick={() => navigate(`/profile/petprofile/${pet.name}`)}
                  >
                    <div className="relative bg-light-mainColor hover:bg-light-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                      <LuView className="size-6" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FaPlus
                    size={24}
                    onClick={() => openModal(index)}
                    className="border border-black rounded-full cursor-pointer"
                  />
                  <p className="text-gray-500 mt-2">Click to add a pet</p>
                  <span className="text-gray-500 mt-1 font-extralight italic">
                    Automatically triggers fetching weight
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select a Pet"
        className="bg-white rounded-lg p-4 max-w-md mx-auto mt-20 border border-gray-300 shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4 text-light-darkViolet">
          Select a Pet
        </h2>
        <ul className="grid grid-cols-3">
          {petList.map((pet) => (
            <li
              key={pet.id}
              onClick={() => addPetToCage(pet)}
              className="p-2 m-2 border border-gray-200 rounded mb-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              {pet.name}
            </li>
          ))}
          <button
            onClick={closeModal}
            className="m-2 bg-light-mainColor text-white p-2 rounded hover:bg-light-darkViolet transition-colors duration-200"
          >
            Cancel
          </button>
        </ul>
      </Modal>
    </div>
  );
}
