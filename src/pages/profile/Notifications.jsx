/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { NotificationContext } from "../function/NotificationsContext";
import { TiDelete } from "react-icons/ti";

const Notifications = ({ notifications: propNotifications }) => {
  const {
    notifications: contextNotifications,
    markAsRead,
    deleteNotification,
  } = useContext(NotificationContext);
  const notifications = propNotifications || contextNotifications;
  const [expandedNotifications, setExpandedNotifications] = useState({});

  const toggleNotification = (id) => {
    setExpandedNotifications((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    const notification = notifications.find(
      (notification) => notification.id === id
    );
    if (notification && !notification.read) {
      markAsRead(id);
    }
  };

  const noNotifications = notifications.length === 0;

  return (
    <div className="mt-4">
      {noNotifications ? (
        <p className="text-gray-600">No notifications received yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white border ${
              notification.read
                ? "border-light-whiteViolet"
                : "border-light-darkViolet"
            } rounded-lg shadow-sm my-2`}
          >
            <div
              className="p-2 cursor-pointer flex justify-between items-center"
              onClick={() => toggleNotification(notification.id)}
            >
              <p
                className={`font-semibold text-base ${
                  notification.read ? "text-gray-800" : "text-light-darkViolet"
                }`}
              >
                {notification.title}
              </p>
              <span
                className={`text-gray-500 transition-transform duration-200 ${
                  expandedNotifications[notification.id]
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              >
                &#x25BC;
              </span>
            </div>
            {expandedNotifications[notification.id] && (
              <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between">
                <p className="text-gray-700">{notification.body}</p>
                {notification.recordData && (
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Records:</p>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
                      {JSON.stringify(notification.recordData, null, 2)}
                    </pre>
                  </div>
                )}
                {notification.feedingInfoData && (
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">
                      Latest Feeding Info:
                    </p>
                    <pre className="text-sm bg-gray-100 p-2 rounded">
                      {JSON.stringify(notification.feedingInfoData, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="w-fit bg-light-mainColor hover:bg-darkViolet py-1 px-2 transition-all duration-300 rounded flex items-center">
                  <TiDelete
                    className="size-6 fill-white hover:fill-light-darkViolet transition-all duration-300 cursor-pointer"
                    onClick={() => deleteNotification(notification.id)}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
