// import { useContext } from "react";
// import { PetContext } from "../function/PetContext";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// export default function Dashboard() {
// const { petRecords } = useContext(PetContext);

// // Ensure petRecords and the required pets' records are defined
// const hanniRecords = petRecords["Hanni"] || [];
// const kazuhaRecords = petRecords["Kazuha"] || [];

// // Map petRecords to a format that recharts can understand
// const hanniData = hanniRecords.map((record, index) => ({
//   name: `Record ${index + 1}`,
//   amount: record.amount,
// }));
// const kazuhaData = kazuhaRecords.map((record, index) => ({
//   name: `Record ${index + 1}`,
//   amount: record.amount,
// }));

// return (
//   <>
//     <p className="font-bold">This is Hanni{`'`}s Amount Dispensed Record</p>
//     <LineChart
//       width={500}
//       height={300}
//       data={hanniData}
//       margin={{
//         top: 5,
//         right: 30,
//         left: 20,
//         bottom: 5,
//       }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="name" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line
//         type="monotone"
//         dataKey="amount"
//         stroke="#8884d8"
//         activeDot={{ r: 8 }}
//       />
//     </LineChart>
//     <p className="font-bold">This is Chaewon{`'`}s Amount Dispensed Record</p>
//     <LineChart
//       width={500}
//       height={300}
//       data={kazuhaData}
//       margin={{
//         top: 5,
//         right: 30,
//         left: 20,
//         bottom: 5,
//       }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="name" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line
//         type="monotone"
//         dataKey="amount"
//         stroke="#8884d8"
//         activeDot={{ r: 8 }}
//       />
//     </LineChart>
//   </>

import { useContext } from "react";
import { PetContext } from "../function/PetContext";
import PetAnalytics from "../analytics/PetAnalytics";

export default function Dashboard() {
  const { petList } = useContext(PetContext);

  return (
    <>
      <h1 className="text-2xl font-bold text-light-darkViolet mb-6">
        Welcome to Dashboard
      </h1>
      <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-auto">
        {petList.map((pet, index) => (
          <div key={index} className="p-4 m-2 border rounded-xl shadow">
            <div
              className="flex
          "
            >
              <div className="flex-col">
                <img
                  src={pet.imageURL}
                  alt={pet.name}
                  className="w-48 h-48 object-cover rounded-xl mb-2"
                />
                <h2 className="text-xl font-bold">{pet.name}</h2>
                <p>Type: {pet.petType}</p>
                <p>Activity Level: {pet.activityLevel}</p>
                <p>Weight: {pet.weight}</p>
              </div>
              <div></div>
              <div className="flex-col">
                <PetAnalytics petId={pet.id} data={pet.data} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
