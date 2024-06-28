import { useState, useEffect } from "react";
import { db } from "../../config/firebase"; // Adjust the path as per your project structure
import { collection, onSnapshot } from "firebase/firestore";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from Firestore
  useEffect(() => {
    console.log('Notifications component mounted.');

    const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched notifications:', notificationsData);
      setNotifications(notificationsData);
    });

    return () => {
      console.log('Cleaning up Notifications component.');
      unsubscribe();
    };
  }, []);

  // Function to safely parse JSON data
  const safeParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON', error);
      return null;
    }
  };

  console.log('Notifications:', notifications);
  // Categorize notifications
  const categorizedNotifications = notifications.reduce((acc, notification) => {
    if (notification.title === 'New Pet Added') {
      acc.newPet.push(notification);
    } else if (notification.title === 'New Pet Record Added') {
      acc.newPetRecord.push(notification);
    } else if (notification.title === 'New Feeding Information') {
      acc.newFeedingInfo.push(notification);
    }
    return acc;
  }, { newPet: [], newPetRecord: [], newFeedingInfo: [] });

  const noNotifications = notifications.length === 0;


  console.log(categorizedNotifications)
  
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold text-light-darkViolet">Notifications</h2>

      {noNotifications ? (
        <p className="text-gray-600">No notifications received yet.</p>
      ) : (
        <>
          {categorizedNotifications.newPet.length > 0 && (
            <div>
              {categorizedNotifications.newPet.map(notification => (
                <div key={notification.id} className="bg-white shadow-md rounded-lg overflow-hidden my-4">
                  <div className="p-4">
                    <p className="font-bold text-lg">{notification.title}</p>
                    <p className="text-gray-700">{notification.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {categorizedNotifications.newPetRecord.length > 0 && (
            <div>
              {categorizedNotifications.newPetRecord.map(notification => (
                <div key={notification.id} className="bg-white shadow-md rounded-lg overflow-hidden my-4">
                  <div className="p-4">
                    <p className="font-bold text-lg">{notification.title}</p>
                    <p className="text-gray-700">{notification.body}</p>
                  </div>
                  <div className="bg-gray-100 p-4">
                    <p className="text-gray-600">Records:</p>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(safeParseJSON(notification.recordData), null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {categorizedNotifications.newFeedingInfo.length > 0 && (
            <div>
              {categorizedNotifications.newFeedingInfo.map(notification => (
                <div key={notification.id} className="bg-white shadow-md rounded-lg overflow-hidden my-4">
                  <div className="p-4">
                    <p className="font-bold text-lg">{notification.title}</p>
                    <p className="text-gray-700">{notification.body}</p>
                  </div>
                  <div className="bg-gray-100 p-4">
                    <p className="text-gray-600">Latest Feeding Info:</p>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(safeParseJSON(notification.feedingInfoData), null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
