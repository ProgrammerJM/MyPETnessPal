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
      date: new Date(record.date),
    }))
    .sort((a, b) => a.date - b.date);
};

const analyzeRecords = (records) => {
  const totalFoodConsumed = records.reduce(
    (total, record) => total + record.amount,
    0
  );
  const avgFoodConsumedPerDay = totalFoodConsumed / records.length;

  const consumptionByMode = records.reduce((total, record) => {
    total[record.mode] = (total[record.mode] || 0) + record.amount;
    return total;
  }, {});

  const consumptionByUser = records.reduce((total, record) => {
    total[record.userName] = (total[record.userName] || 0) + record.amount;
    return total;
  }, {});

  return {
    totalFoodConsumed,
    avgFoodConsumedPerDay,
    consumptionByMode,
    consumptionByUser,
  };
};

const TrendChart = ({ data, dataKey, name, stroke }) => (
  <ResponsiveContainer width="95%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={dataKey}
        name={name}
        stroke={stroke}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

TrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
  dataKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
};

const VisualizeWeightTrend = ({ records }) => {
  const data = records.map((record) => ({
    date: record.date.toLocaleDateString(),
    weight: record.weight,
  }));

  return (
    <>
      <h2 className="text-l font-bold">Weight Trend</h2>
      <TrendChart
        data={data}
        dataKey="weight"
        name="Weight (kg)"
        stroke="#82ca9d"
      />
    </>
  );
};

const VisualizeAmountRecords = ({ records }) => {
  const data = records.map((record) => ({
    date: record.date.toLocaleDateString(),
    amount: record.amount,
    weight: record.weight,
  }));

  return (
    <>
      <h2 className="text-l font-bold">Amount Dispensed Trend</h2>
      <TrendChart
        data={data}
        dataKey="amount"
        name="Amount Dispensed (g)"
        stroke="#8884d8"
      />
    </>
  );
};

const VisualizeAmountRemainRecords = ({ records }) => {
  let cumulativeFoodConsumed = 0;

  const data = records.map((record) => {
    cumulativeFoodConsumed += record.foodConsumed;
    const remainingAmount = cumulativeFoodConsumed - record.amountRemain;

    return {
      date: record.date.toLocaleDateString(),
      amountRemain: remainingAmount >= 0 ? remainingAmount : 0,
    };
  });

  return (
    <>
      <h2 className="text-l font-bold">Food Amount Remain Trend</h2>
      <TrendChart
        data={data}
        dataKey="amountRemain"
        name="Amount Remain (g)"
        stroke="#82ca9d"
      />
    </>
  );
};

const Summary = ({
  totalFoodConsumed,
  avgFoodConsumedPerDay,
  consumptionByMode,
  consumptionByUser,
}) => (
  <div className="mx-10 flex flex-col">
    <p>
      <span className="font-bold text-light-darkViolet">Summary</span>
    </p>
    <p>
      <span className="font-bold text-darkViolet">Total Food Consumed: </span>
      {Number.isNaN(totalFoodConsumed) ? "N/A" : totalFoodConsumed} g
    </p>
    <p>
      <span className="font-bold text-darkViolet">
        Average Food Consumed Per Day:{" "}
      </span>
      {Number.isNaN(avgFoodConsumedPerDay) ? "N/A" : avgFoodConsumedPerDay} g
    </p>
    <span className="font-bold text-darkViolet">Consumption By Mode: </span>
    {Object.entries(consumptionByMode).map(([mode, amount]) => (
      <p key={mode} className="mx-2">
        {mode}: {amount} g
      </p>
    ))}
    <span className="font-bold text-darkViolet">Consumption by User: </span>
    {Object.entries(consumptionByUser).map(([user, amount]) => (
      <p key={user} className="mx-2">
        {user}: {amount} g
      </p>
    ))}
  </div>
);

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
    return (
      <p className="text-center text-gray-500 p-10">
        No analytics information available
      </p>
    );
  }

  return (
    <div className="p-4 lg:p-10">
      <h1 className="font-bold text-light-darkViolet text-xl">PET Analytics</h1>
      <div className="flex flex-wrap justify-start max-w-screen-xl p-4">
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <VisualizeWeightTrend records={processedRecords} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <VisualizeAmountRecords records={processedRecords} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <VisualizeAmountRemainRecords records={processedRecords} />
        </div>
      </div>
      <Summary
        totalFoodConsumed={totalFoodConsumed}
        avgFoodConsumedPerDay={avgFoodConsumedPerDay}
        consumptionByMode={consumptionByMode}
        consumptionByUser={consumptionByUser}
      />
    </div>
  );
};

VisualizeWeightTrend.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
    })
  ).isRequired,
};

VisualizeAmountRecords.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
    })
  ).isRequired,
};

VisualizeAmountRemainRecords.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amountRemain: PropTypes.number.isRequired,
    })
  ).isRequired,
};

Summary.propTypes = {
  totalFoodConsumed: PropTypes.number.isRequired,
  avgFoodConsumedPerDay: PropTypes.number.isRequired,
  consumptionByMode: PropTypes.object.isRequired,
  consumptionByUser: PropTypes.object.isRequired,
};

PetAnalytics.propTypes = {
  petId: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default PetAnalytics;
