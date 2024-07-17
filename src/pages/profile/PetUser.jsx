import { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
// import { PiVideoCameraSlashThin } from "react-icons/pi";
import PetAnalytics from "../analytics/PetAnalytics";
import { PetContext } from "../../pages/function/PetContext"; // Import the context
import CameraStream from "../camerastream/CameraStream";
import profileBG from "../../assets/images/profilebg.jpg";

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

  // console.log(petName);

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

  // console.log(latestFeedingInfo);
  // console.log(currentRecords);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <main>
        <button
          className="text-white inline-flex items-center justify-center gap-2 rounded-md bg-light-darkViolet py-3 px-6
          text-center font-medium hover:bg-opacity-90 mb-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>

        {/* Welcome Banner */}
        <header
          style={{ backgroundImage: `url(${profileBG})` }}
          className="max-[360px]:w-full lg:w-full sm:w-full md:w-full relative bg-no-repeat p-4 sm:p-6 rounded-t-xl overflow-hidden mb-2 shadow-md bg-cover"
        >
          <div className="relative">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
              Pet Profile: {petName} 👋
            </h1>
            <p className="dark:text-indigo-200">Hi its me, {petId}!</p>
          </div>
        </header>

        <section className="max-[440px]:gap-y-4 grid grid-cols-1 md:grid-cols-3 md:mt-6 md:gap-2 2xl:mt-7.5 w-full">
          {/* PET PROFILE DEETS */}
          <article className=" max-[440px]:w-full lg-full md:w-full flex lg:w-full md:p-4 p-4 lg:flex-col lg:justify-center md:flex-row sm:flex-row md:items-center col-span-2 border border-stroke bg-white shadow-default dark:border-strokedark sm:px-7.5 rounded-xl shadow-md">
            <div className="flex items-center md:justify-start">
              <div className="rounded-full bg-light-darkViolet/80 backdrop-blur lg:w-fit md:w-full w-full p-1 mr-4">
                <div className=" rounded-full bg-white p-1 overflow-hidden">
                  <img
                    src={
                      petData.imageURL ||
                      "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    }
                    alt="Pet User Image : Selected Pet Profile Picture"
                    className="max-[440px]:w-full w-36 h-36 md:w-48 md:h-48 lg:h-48 lg:w-48 object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col text-left lg:ml-2 md:mt-0 md:ml-10">
                <h2 className="text-xl lg:my-4 font-semibold text-gray-900">
                  {petName}
                </h2>
                <p className="text-md text-gray-600">
                  <span className="font-semibold">Pet Type:</span>{" "}
                  {petData.petType}
                </p>
                <p className="text-md text-gray-600">
                  <span className="font-semibold">Current Weight:</span>{" "}
                  {petData.weight} kg
                </p>
                <p className="text-md text-gray-600">
                  <span className="font-semibold">Age:</span> 16 Months
                </p>
                <p className="text-md text-gray-600">
                  <span className="font-semibold">Activity Level:</span>{" "}
                  {petData.activityLevel}
                </p>
                <p className="text-md text-gray-600">
                  <span className="font-semibold block sm:block max-w-sm break-words">
                    Food Selected:{" "}
                    {latestFeedingInfo?.foodSelectedName || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </article>

          <aside className="max-[440px]:w-full max-[440px]:h-auto max-[440px]:m-0  flex justify-center border border-stroke bg-white p-4 md:p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md items-center mt-4 md:mt-0">
            <CameraStream />
          </aside>
        </section>

        {/* PET RECORDS CHART */}
        <section className="max-[440px]:p-4 mt-5 col-span-12 border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md">
          <h1 className="text-xl font-bold mb-4 text-light-darkViolet">
            Pet Records
          </h1>
          {currentRecords.length > 0 ? (
            <div className="overflow-x-auto max-h-72 xl:w-full w-full max-[440px]:w-72">
              <table className="bg-lavender w-full">
                <thead className="text-left justify-center items-center">
                  <tr>
                    {/* <th className="py-2 px-6 border-b text-lavender-dark">
                      ID
                    </th> */}
                    <th className="py-2 px-6 border-b text-lavender-dark">
                      Mode
                    </th>
                    <th className="py-2 px-6 border-b text-lavender-dark">
                      Date
                    </th>
                    <th className="py-2 px-6 border-b text-lavender-dark">
                      Time
                    </th>
                    <th className="py-2 px-6 border-b text-lavender-dark">
                      Amount Dispensed (g)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      {/* <td className="py-2 px-6 border-b text-sm">
                        {record.id}
                      </td> */}
                      <td className="py-2 px-6 border-b text-sm">
                        {record.mode}
                      </td>
                      <td className="py-2 px-6 border-b text-sm">
                        {record.date}
                      </td>
                      <td className="py-2 px-6 border-b text-sm">
                        {record.time}
                      </td>
                      <td className="py-2 px-6 border-b text-sm">
                        {record.amount} g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No record information available
            </p>
          )}
        </section>

        {/* PetAnalytics here */}
        <section className="mt-5 col-span-12 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl shadow-md">
          <PetAnalytics data={currentRecords} petId={petId} />
        </section>
      </main>
    </div>
  );
}
