import { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { PiVideoCameraSlashThin } from "react-icons/pi";
import PetAnalytics from "../analytics/PetAnalytics";
import { PetContext } from "../../pages/function/PetContext"; // Import the context

export default function PetUser() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [latestFeedingInfo, setLatestFeedingInfo] = useState({});
  const { petList } = useContext(PetContext); // Access pet list from context
  // const { petFoodList } = useContext(PetContext); // Access pet food list from context
  const { petRecords } = useContext(PetContext); // Access pet records from context

  const petData = useMemo(
    () => petList.find((pet) => pet.id === petId),
    [petList, petId]
  );
  const petName = petData ? petData.name : "Unknown";

  console.log(petName);

  useEffect(() => {
    const fetchLatestFeedingInfo = async () => {
      try {
        const q = query(
          collection(db, `pets/${petName}/feedingInformations/`),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setLatestFeedingInfo(doc.data());
        } else {
          console.log("No documents found in the collection.");
        }
      } catch (error) {
        console.error("Error fetching latest feeding info:", error);
      }
    };
    if (petName !== "Unknown") {
      fetchLatestFeedingInfo();
    }
  }, [petName]);

  const currentRecords = useMemo(
    () => petRecords[petName] || [],
    [petRecords, petName]
  );

  if (!petData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <button
            className="text-white inline-flex items-center justify-center gap-2 rounded-md bg-darkViolet py-3 px-6
        text-center font-medium hover:bg-opacity-90 mb-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          {/* Welcome Banner */}
          <div className="relative bg-profileBG bg-no-repeat p-4 sm:p-6 rounded-t-xl overflow-hidden mb-2 shadow-md bg-cover">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
                Pet Profile: {petName} 👋
              </h1>
              <p className="dark:text-indigo-200">Hi its me, {petId}!</p>
            </div>
          </div>
          <div className="grid grid-cols-3 md:mt-6 md:gap-3 2xl:mt-7.5 w-full">
            {/* PET PROFILE DEETS */}
            <div className="flex max-sm:flex-col max-sm:p-5 items-center col-span-2 border border-stroke bg-white p-10 shadow-default dark:border-strokedark sm:px-7.5 rounded-xl shadow-md">
              <div className="flex items-center ml-10 max-sm:m-0">
                <div className="rounded-full bg-darkViolet/80 backdrop-blur p-1">
                  <div className="rounded-full bg-white p-1 overflow-hidden size-48">
                    {/* Insert Here Selected Pet Profile Picture */}
                    <img
                      src={
                        petData.imageURL ||
                        "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }
                      alt="Pet User Image : Selected Pet Profile Picture"
                      className="w-full h-full object-cover rounded-full max-sm:w-fit-content max-sm:h-fit-content "
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left ml-10 max-sm:m-0">
                <h2 className="text-xl my-4 font-semibold text-gray-900">
                  {petName}
                </h2>

                <p className="text-md text-gray-600">
                  {/* PET'S TYPE */}
                  <span className="font-semibold">Pet Type:</span>{" "}
                  {petData.petType}
                </p>
                <p className="text-md text-gray-600">
                  {/* PET'S CURRENT WEIGHT */}
                  <span className="font-semibold">Current Weight:</span>{" "}
                  {petData.weight} kg
                </p>
                <p className="text-md text-gray-600">
                  {/* PET'S AGE */}
                  <span className="font-semibold">Age:</span> 16 Months
                </p>
                <p className="text-md text-gray-600">
                  {/* PET'S ACTIVITY LEVEL */}
                  <span className="font-semibold">Activity Level: </span>
                  {petData.activityLevel}
                </p>
                <p className="text-md text-gray-600">
                  {/* FOOD SELECTED */}
                  <span className="font-semibold">
                    Food Selected: {latestFeedingInfo.foodSelectedName || "N/A"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-center border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md items-center ">
              <PiVideoCameraSlashThin className="w-48 h-48 " />
            </div>
          </div>

          {/* PET RECORDS CHART */}
          <div className="mt-5 col-span-12 border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md">
            <h1
              className="text-xl
             font-bold mb-4 text-darkViolet"
            >
              Pet Records
            </h1>
            {currentRecords.length > 0 ? (
              <>
                <div className="justify-center overflow-x-auto max-h-72 xl:w-full">
                  <table className="text-left bg-lavender">
                    <thead>
                      <tr className="text-left">
                        <th className="py-2 px-6 border-b text-lavender-dark">
                          ID
                        </th>
                        <th className="py-2 px-6 border-b text-lavender-dark">
                          Mode
                        </th>
                        <th className="py-2 px-6 border-b text-lavender-dark  text-justify">
                          Date
                        </th>
                        <th className="py-2 px-6 border-b text-lavender-dark">
                          Time
                        </th>
                        <th className="py-2 px-6 border-b text-lavender-dark">
                          Amount Dispensed (g)
                        </th>
                        <th className="py-2 px-6 border-b text-lavender-dark">
                          Amount Remain (g)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-left">
                      {currentRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="py-2 px-6 border-b text-left text-sm">
                            {record.id}
                          </td>
                          <td className="py-2 px-6 border-b text-center text-sm">
                            {record.mode}
                          </td>
                          <td className="py-2 px-6 border-b text-center text-sm">
                            {record.date}
                          </td>
                          <td className="py-2 px-6 border-b text-center text-sm">
                            {record.time}
                          </td>
                          <td className="py-2 px-6 border-b text-center text-sm">
                            {record.amount} g
                          </td>
                          <td className="py-2 px-6 border-b text-center text-sm">
                            {record.amountRemain} g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">
                No record information available
              </p>
            )}
          </div>

          {/* PetAnalytics here */}
          <div className="mt-5 col-span-12 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md">
            <PetAnalytics data={currentRecords} petId={petId} />
          </div>
        </main>
      </div>
    </>
  );
}
