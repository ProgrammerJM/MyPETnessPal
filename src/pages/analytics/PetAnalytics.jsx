import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PetRecords from "../function/PetRecords";
import PropTypes from "prop-types";

const processRecords = (records) => {
  return records
    .map((record) => ({
      ...record,
      date: record.date, // Use the date string directly
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort records by date
};

const analyzeRecords = (records) => {
  const totalFoodConsumed = records.reduce(
    (total, record) => total + record.amount,
    0
  );
  const avgFoodConsumedPerDay = totalFoodConsumed / records.length;

  const consumptionByMode = records.reduce((total, record) => {
    if (!total[record.mode]) {
      total[record.mode] = 0;
    }
    total[record.mode] += record.amount;
    return total;
  }, {});

  const consumptionByUser = records.reduce((total, record) => {
    if (!total[record.userName]) {
      total[record.userName] = 0;
    }
    total[record.userName] += record.amount;
    return total;
  }, {});

  return {
    totalFoodConsumed,
    avgFoodConsumedPerDay,
    consumptionByMode,
    consumptionByUser,
  };
};

const VisualizeAmountRecords = ({ records }) => {
  const data = records.map((record) => ({
    date: new Date(record.date).toLocaleDateString(), // Format date as MM/DD/YYYY
    amount: record.amount,
    weight: record.weight,
  }));

  return (
    <>
      <h2 className="text-xl font-bold">Amount Dispensed Trend</h2>
      <br />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const VisualizeWeightTrend = ({ records }) => {
  const data = records.map((record) => ({
    date: new Date(record.date).toLocaleDateString(), // Format date as MM/DD/YYYY
    weight: record.weight,
  }));

  return (
    <>
      <h2 className="text-xl font-bold">Weight Trend</h2>
      <br />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const VisualizeAmountRemainRecords = ({ records }) => {
  const data = records.map((record) => ({
    date: new Date(record.date).toLocaleDateString(), // Format date as MM/DD/YYYY
    amountRemain: record.amountRemain,
  }));

  return (
    <>
      <h2 className="text-xl font-bold">Food Amount Remain Trend</h2>
      <br />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amountRemain"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const PetAnalytics = ({ petId, data }) => {
  const [records, setRecords] = useState([]);
  const processedRecords = processRecords(records);
  const {
    totalFoodConsumed,
    avgFoodConsumedPerDay,
    consumptionByMode,
    consumptionByUser,
  } = analyzeRecords(processedRecords);

  useEffect(() => {
    const fetchRecords = async () => {
      const rawRecords = await PetRecords(petId);
      setRecords(rawRecords);
    };

    fetchRecords();
  }, [petId]);

  if (!data || data.length === 0) {
    return <p>No analytics information available</p>;
  }

  return (
    <>
      <div className="mx-10 flex">
        <p>
          <span className="font-bold">Total Food Consumed: </span>
          {Number.isNaN(totalFoodConsumed) ? "N/A" : totalFoodConsumed} g
        </p>
      </div>
      <div className="mx-10 flex">
        <p>
          <span className="font-bold">Average Food Consumed Per Day: </span>
          {Number.isNaN(avgFoodConsumedPerDay)
            ? "N/A"
            : avgFoodConsumedPerDay}{" "}
          g
        </p>
      </div>
      <div className="mx-10 flex">
        <span className="font-bold">Consumption By Mode: </span>
        {Object.entries(consumptionByMode).map(([mode, amount]) => (
          <p key={mode} className="mx-16">
            {mode}: {amount} g
          </p>
        ))}
      </div>
      <div className="mx-10 flex">
        <h3 className="font-bold">Consumption by User: </h3>
        {Object.entries(consumptionByUser).map(([user, amount]) => (
          <p key={user}>
            {user}: {amount} g
          </p>
        ))}
      </div>
      <div className="flex flex-wrap justify-start max-w-screen-xl p-4">
        <div className="w-full md:w-1/2 lg:w-1/3 p-4 flex-shrink-0">
          <VisualizeWeightTrend records={processedRecords} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4 flex-shrink-0">
          <VisualizeAmountRecords records={processedRecords} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4 flex-shrink-0">
          <VisualizeAmountRemainRecords records={processedRecords} />
        </div>
      </div>
    </>
  );
};

VisualizeAmountRecords.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      amount: PropTypes.number,
    })
  ).isRequired,
};
PetAnalytics.propTypes = {
  petId: PropTypes.string,
  data: PropTypes.array,
};
VisualizeWeightTrend.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      weight: PropTypes.number,
    })
  ).isRequired,
};
VisualizeAmountRemainRecords.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      amountRemain: PropTypes.number,
    })
  ).isRequired,
};

export default PetAnalytics;
