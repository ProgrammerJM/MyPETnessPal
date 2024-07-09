import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { PetContext } from "../function/PetContext";
import { NotificationContext } from "../function/NotificationsContext";
import PetAnalyticsSummary from "../analytics/PetAnalyticsSummary";
import Notifications from "../profile/Notifications";
import PetRecords from "../function/PetRecords";

export default function Dashboard() {
  const { petList, latestFeedingInfo } = useContext(PetContext);
  const { notifications, unreadCount } = useContext(NotificationContext);
  const [petRecords, setPetRecords] = useState({});

  useEffect(() => {
    const fetchAllRecords = async () => {
      const records = {};
      for (const pet of petList) {
        const petName = pet.name;
        try {
          records[petName] = await PetRecords(petName);
        } catch (error) {
          console.error(`Error fetching records for ${petName}:`, error);
        }
      }
      setPetRecords(records);
    };

    if (petList.length > 0) {
      fetchAllRecords();
    }
  }, [petList]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-light-darkViolet mb-4">
          Welcome to Dashboard
        </h1>
        <div className="flex justify-between">
          <div className="text-lg">
            <p>Total Pets: {petList.length}</p>
            <p>Unread Notifications: {unreadCount}</p>
          </div>
        </div>
      </header>
      <div className="flex flex-grow">
        <main className="flex-grow p-4">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-light-darkViolet">
              Your Pets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {petList.map((pet, index) => (
                <div
                  key={index}
                  className="bg-white p-4 border rounded-lg shadow-lg flex flex-col"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mb-4">
                      <img
                        src={pet.imageURL}
                        alt={pet.name}
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow pl-4">
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p>Type: {pet.petType}</p>
                      <p>Activity Level: {pet.activityLevel}</p>
                      <p>Weight: {pet.weight} kg</p>
                      {latestFeedingInfo[pet.name] && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Last Date Fed:{" "}
                            {latestFeedingInfo[pet.name].scheduledDate || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Mode of Feeding:{" "}
                            {latestFeedingInfo[pet.name].feedingMode || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            RER:{" "}
                            {isNaN(Number(latestFeedingInfo[pet.name].RER))
                              ? "N/A"
                              : Number(latestFeedingInfo[pet.name].RER).toFixed(
                                  2
                                )}
                          </p>
                          <p className="text-sm text-gray-500">
                            MER:{" "}
                            {isNaN(Number(latestFeedingInfo[pet.name].MER))
                              ? "N/A"
                              : Number(latestFeedingInfo[pet.name].MER).toFixed(
                                  2
                                )}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last Fed:{" "}
                            {isNaN(
                              Number(latestFeedingInfo[pet.name].amountToFeed)
                            )
                              ? "N/A"
                              : `${latestFeedingInfo[pet.name].amountToFeed} g`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <h4 className="text-lg font-semibold mb-2 text-light-darkViolet text-center">
                      PET Analytics Summary
                    </h4>
                    <div className="h-fit">
                      <PetAnalyticsSummary data={petRecords[pet.name] || []} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-light-darkViolet">
              Notifications
            </h2>
            <Notifications notifications={notifications} />
          </section>
        </main>
      </div>
    </div>
  );
}

{
  /* <aside className="w-1/5 bg-light-mainColor text-white p-4">
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/profile/petprofile" className="hover:underline">
                  Pets
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/food-records" className="hover:underline">
                  Food Records
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/analytics" className="hover:underline">
                  Analytics
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile/notifications" className="hover:underline">
                  Notifications
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile/help" className="hover:underline">
                  Help
                </Link>
              </li>
            </ul>
          </nav>
        </aside> */
}
