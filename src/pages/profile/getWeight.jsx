import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import PropTypes from "prop-types";

export default function GetWeight({ setPetWeight }) {
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState(null);

  const handleClick = async () => {
    setLoading(true);

    // Update Realtime Database to trigger ESP32 weight data send
    const triggerRef = ref(realtimeDatabase, "trigger/getPetWeight");
    await set(triggerRef, { status: true });
  };

  useEffect(() => {
    const weightRef = ref(realtimeDatabase, "getWeight/loadCell/weight");

    const unsubscribe = onValue(weightRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setPetWeight(Number(data));
        setWeight(Number(data));
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setPetWeight]);

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className="border p-2 rounded bg-mainColor text-white hover:bg-darkViolet transition-colors duration-300"
      >
        {loading ? "Fetching Weight..." : "Get Weight"}
      </button>
      {weight !== null && (
        <p className="ml-2">Current Weight: {weight} grams</p>
      )}
    </div>
  );
}

GetWeight.propTypes = {
  setPetWeight: PropTypes.func.isRequired,
};
