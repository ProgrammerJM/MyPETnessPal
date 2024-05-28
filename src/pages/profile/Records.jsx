// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { db } from "../../config/firebase"; // Import the initialized Firestore instance
// import { collection, getDocs } from "firebase/firestore"; // Import collection and getDocs from Firestore
// import PropTypes from "prop-types";

// export default function Records() {

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Access Firestore from imported instance
//         const querySnapshot = await getDocs(collection(db, "petRecords")); // Replace 'your_collection' with your collection name
//         const fetchedData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           date: doc.data().date, // Assuming 'date' is a field in your Firestore documents
//           weight: doc.data().weight, // Assuming 'weight' is a field in your Firestore documents
//         }));

//         setData(fetchedData);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="w-full">
//       <h2>Weight Records</h2>
//       <div className="w-full max-w-screen-lg mx-auto">
//         <LineChart width={200} height={200} data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="weight"
//             stroke="#8884d8"
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </div>
//     </div>
//   );
// }
// Records.propTypes = {
//   customId: PropTypes.string.isRequired,
// };

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { db } from "../../config/firebase"; // Import the initialized Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Import collection and getDocs from Firestore
import PropTypes from "prop-types";

export default function Records({ customId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Access Firestore from imported instance
        const querySnapshot = await getDocs(
          collection(db, `pets/${customId}/records`)
        ); // Replace 'your_collection' with your collection name
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date, // Assuming 'date' is a field in your Firestore documents
          weight: doc.data().weight, // Assuming 'weight' is a field in your Firestore documents
        }));

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <h2>Weight Records</h2>
      <div className="w-full max-w-screen-lg mx-auto">
        <LineChart width={200} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
Records.propTypes = {
  customId: PropTypes.string.isRequired,
};
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { ref } from "firebase/database"; // Import ref separately
// import { realtimeDatabase } from "../../config/firebase";

// export default function Records() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const petRecords = () => {
//       try {
//         // Access Firebase Realtime Database reference
//         const dbRef = ref(
//           realtimeDatabase,
//           "/petFeedingSchedule/Meme/petRecords"
//         );

//         // Listen for changes in the data
//         dbRef.on("value", (snapshot) => {
//           const fetchedData = [];
//           snapshot.forEach((childSnapshot) => {
//             fetchedData.push({
//               id: childSnapshot.key,
//               date: childSnapshot.val().scheduledDate,
//               weight: parseInt(childSnapshot.val().weight),
//               amountDispensed: parseInt(childSnapshot.val().amountDispensed),
//               dispensingDate: childSnapshot.val().dispensingDate,
//               dispensingTime: childSnapshot.val().dispensingTime,
//               scheduledTime: childSnapshot.val().scheduledTime,
//             });
//           });
//           setData(fetchedData);
//         });
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     petRecords();

//     // Unsubscribe from Realtime Database changes when component unmounts
//     return () =>
//       realtimeDatabase.ref("/petFeedingSchedule/Meme/petRecords").off();
//   }, []);

//   return (
//     <div className="w-full">
//       <h2>Weight and Feeding Records</h2>
//       <div className="w-full max-w-screen-lg mx-auto">
//         <LineChart width={800} height={400} data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="weight"
//             name="Weight"
//             stroke="#8884d8"
//             activeDot={{ r: 8 }}
//           />
//           <Line
//             type="monotone"
//             dataKey="amountDispensed"
//             name="Amount Dispensed"
//             stroke="#82ca9d"
//             activeDot={{ r: 8 }}
//           />
//           {/* You can add more Line components for other fields */}
//         </LineChart>
//       </div>
//     </div>
//   );
// }
