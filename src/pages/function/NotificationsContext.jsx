import { createContext, useState, useEffect } from "react";
import { db } from "../../config/firebase"; // Adjust the path as per your project structure
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import PropTypes from "prop-types";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsData);

      // Update unread count
      const unread = notificationsData.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    const notificationRef = doc(db, "notifications", id);
    await updateDoc(notificationRef, { read: true });

    // Update the local state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (confirmation) {
      const notificationRef = doc(db, "notifications", id);

      await deleteDoc(notificationRef);

      // Update the local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
