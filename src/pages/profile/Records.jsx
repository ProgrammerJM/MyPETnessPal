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

export default function Records() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Access Firestore from imported instance
        const querySnapshot = await getDocs(collection(db, "petRecords")); // Replace 'your_collection' with your collection name
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
