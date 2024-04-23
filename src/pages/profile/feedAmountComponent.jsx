import { useState, useEffect } from "react";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import PropTypes from "prop-types";

const FeedAmountComponent = ({
  petId,
  petName,
  petType,
  weight,
  activityLevel,
}) => {
  const [feedAmount, setFeedAmount] = useState(null);
  const [computed, setComputed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "petFeedAmounts", petId), (doc) => {
      if (doc.exists()) {
        setComputed(doc.data().smartFeedingActivated);
        setFeedAmount(doc.data().amount);
      }
    });
    return () => unsubscribe();
  }, [petId]);

  const petFeedAmountsCollectionRef = collection(db, "petFeedAmounts");
  const petFeedAmountDocRef = doc(petFeedAmountsCollectionRef, petId);

  useEffect(() => {
    if (computed) {
      const computeFeedAmount = async () => {
        try {
          let baseAmount = 0;
          switch (petType.toLowerCase()) {
            case "dog":
              baseAmount = weight * 0.02; // Assume 2% of weight for dogs
              break;
            case "cat":
              baseAmount = weight * 0.03; // Assume 3% of weight for cats
              break;
            // Add more cases for other pet types as needed
            default:
              baseAmount = 0;
          }
          const adjustedAmount = baseAmount * (1 + activityLevel / 10);

          setFeedAmount(adjustedAmount);

          await setDoc(petFeedAmountDocRef, {
            amount: adjustedAmount,
            petType: petType,
            petName: petName,
            smartFeedingActivated: computed, // Save smart feeding state
          });

          setComputed(true);
        } catch (error) {
          setError(error.message);
          console.error("Error saving feed amount:", error);
        }
      };

      computeFeedAmount();
    }
  }, [computed]);

  const toggleSmartFeeding = async () => {
    try {
      await setDoc(petFeedAmountDocRef, {
        amount: feedAmount || 0, // Save current feed amount
        petType: petType,
        petName: petName,
        smartFeedingActivated: !computed, // Toggle smart feeding state
      });

      setComputed(!computed);
    } catch (err) {
      console.error("Error toggling smart feeding:", err);
    }
  };

  return (
    <div>
      <button onClick={toggleSmartFeeding} className="border p-2">
        {computed ? "Disable Smart Feeding" : "Smart Feeding"}
      </button>
      {error && <p>Error: {error}</p>}
      {computed && feedAmount !== null && (
        <p>Amount to Feed in Grams (g) : {feedAmount}</p>
      )}
    </div>
  );
};

FeedAmountComponent.propTypes = {
  petId: PropTypes.string.isRequired,
  petName: PropTypes.string.isRequired,
  petType: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  activityLevel: PropTypes.number.isRequired,
};

export default FeedAmountComponent;
