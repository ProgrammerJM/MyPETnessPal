/* eslint-disable react/prop-types */
const PetAnalyticsSummary = ({ data }) => {
  if (data.length === 0) {
    return <p>No analytics information available</p>;
  }

  // Use the latest record
  const latestRecord = data[0];
  const { weight, foodConsumed, amount, cageID, date, time, mode } =
    latestRecord;

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2">
        <h4 className="text-lg font-semibold text-light-darkViolet">
          Latest Analytics
        </h4>
      </div>
      <div className="text-md text-gray-600">
        <p>
          <span className="font-semibold">Date:</span> {date}
        </p>
        <p>
          <span className="font-semibold">Time:</span> {time}
        </p>
        <p>
          <span className="font-semibold">Mode:</span> {mode}
        </p>
        <p>
          <span className="font-semibold">Weight:</span> {weight} kg
        </p>
        <p>
          <span className="font-semibold">Food Consumed:</span> {foodConsumed} g
        </p>
        <p>
          <span className="font-semibold">Amount:</span> {amount} g
        </p>
        <p>
          <span className="font-semibold">Cage ID:</span> {cageID}
        </p>
      </div>
    </div>
  );
};

export default PetAnalyticsSummary;
