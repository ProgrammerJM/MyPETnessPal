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

  // Correcting startDate and endDate calculation
  const sortedDates = records
    .map((record) => new Date(record.date))
    .sort((a, b) => a - b);
  const startDate = sortedDates[0]
    ? sortedDates[0].toISOString().split("T")[0]
    : null;
  const endDate = sortedDates[sortedDates.length - 1]
    ? sortedDates[sortedDates.length - 1].toISOString().split("T")[0]
    : null;

  return {
    totalFoodConsumed,
    avgFoodConsumedPerDay,
    consumptionByMode,
    consumptionByUser,
    startDate,
    endDate,
  };
};

const TrendChart = ({ data, dataKey, name, stroke, customTooltip }) => (
  <ResponsiveContainer width="95%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      {customTooltip ? <Tooltip content={customTooltip} /> : <Tooltip />}
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
  customTooltip: PropTypes.func,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          color: "#8884d8",
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="text-black">{`Date: ${label}`}</p>
        <p>{`Mode: ${payload[0].payload.mode}`}</p>
        <p>{`Amount Dispensed: ${payload[0].value}g`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      payload: PropTypes.shape({
        mode: PropTypes.string,
      }),
    })
  ),
  label: PropTypes.string,
};

const VisualizeAmountRecords = ({ records }) => {
  const data = records.map((record) => ({
    date: record.date.toLocaleDateString(),
    amount: record.amount,
    weight: record.weight,
    mode: record.mode,
  }));

  return (
    <>
      <h2 className="text-l font-bold">Amount Dispensed Trend</h2>
      <TrendChart
        data={data}
        dataKey="amount"
        name="Amount Dispensed (g)"
        stroke="#8884d8"
        customTooltip={<CustomTooltip />}
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

  // IF THE AMOUNT REMAIN SHOULD ONLY BE FOR SMART FEEDING
  // const VisualizeAmountRemainRecords = ({ records }) => {
  //   let cumulativeFoodConsumed = 0;

  //   // Filter records to include only those with mode "Smart"
  //   const filteredRecords = records.filter((record) => record.mode === "Smart");

  //   const data = filteredRecords.map((record) => {
  //     cumulativeFoodConsumed += record.foodConsumed;
  //     const remainingAmount = cumulativeFoodConsumed - record.amountRemain;

  //     return {
  //       date: record.date.toLocaleDateString(),
  //       amountRemain: remainingAmount >= 0 ? remainingAmount : 0,
  //     };
  //   });

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
  startDate,
  endDate,
}) => (
  <div className="mx-10 lg:flex lg:flex-col items-center block justify-center">
    <p>
      <span className="font-bold text-light-darkViolet text-xl">Summary</span>
    </p>
    <p>
      <span className="font-bold text-darkViolet mr-2 block sm:inline-block max-w-full break-words">
        Date Range:{" "}
      </span>
      {startDate} to {endDate}
    </p>
    <p>
      <span className="font-bold text-darkViolet mr-2 block sm:inline-block max-w-full break-words">
        Total Food Consumed:{" "}
      </span>
      {Number.isNaN(totalFoodConsumed)
        ? "N/A"
        : Number(totalFoodConsumed).toFixed(2)}{" "}
      g
    </p>
    <p>
      <span className="font-bold text-darkViolet mr-2 block sm:inline-block max-w-full break-words">
        Average Food Consumed Per Day:{" "}
      </span>
      {Number.isNaN(avgFoodConsumedPerDay)
        ? "N/A"
        : Number(avgFoodConsumedPerDay).toFixed(2)}{" "}
      g
    </p>
    <span className="font-bold text-darkViolet mr-2 block sm:inline-block max-w-full break-words">
      Consumption By Mode:{" "}
    </span>
    {Object.entries(consumptionByMode).map(([mode, amount]) => (
      <p key={mode}>
        {mode}: {Number(amount).toFixed(2)} g
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
    startDate,
    endDate,
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
        startDate={startDate}
        endDate={endDate}
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
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

PetAnalytics.propTypes = {
  petId: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default PetAnalytics;
