/* eslint-disable object-curly-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://petness-92c55-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const region = "asia-southeast1";

// Simple cache object with a time-to-live (TTL) mechanism
const petNameCache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Helper function to get pet name from Firestore with caching
async function getPetName(petId) {
  const cached = petNameCache[petId];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.name;
  }
  const petDoc = await admin.firestore().collection("pets").doc(petId).get();
  const petName = petDoc.data().name;
  petNameCache[petId] = { name: petName, timestamp: Date.now() };
  return petName;
}

// Helper function to create notification messages
function createNotificationMessage(title, body) {
  return {
    title: title,
    body: body,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
}

// Function to send notification on new pet added
exports.sendNotificationOnNewPet = functions
  .region(region)
  .firestore.document("pets/{petId}")
  .onCreate(async (snapshot, context) => {
    const newPet = snapshot.data();
    const newPetMessage = createNotificationMessage(
      `New Pet Added (${newPet.name})`,
      `${newPet.name} has been created.`
    );

    try {
      await admin.firestore().collection("notifications").add({
        title: newPetMessage.title,
        body: newPetMessage.body,
        petName: newPet.name,
        timestamp: newPetMessage.timestamp,
      });
    } catch (error) {
      console.error(
        "Error sending new pet notification:",
        error.message,
        error.stack
      );
    }
  });

// Function to format pet record data into a readable string
function formatPetRecord(record) {
  const fields = [
    `User Name: ${record.userName}`,
    `Cage ID: ${record.cageID}`,
    `Date: ${record.date}`,
    `Time: ${record.time}`,
    `Mode: ${record.mode} Mode`,
    `Amount: ${record.amount}`,
    `Food Consumed: ${record.foodConsumed}`,
    `Weight: ${record.weight}`,
  ];
  return fields
    .filter((field) => field.includes(": null") === false)
    .join(", ");
}

// Function to send notification on new pet record added
exports.sendNotificationOnNewPetRecord = functions
  .region(region)
  .firestore.document("pets/{petId}/records/{recordId}")
  .onCreate(async (snapshot, context) => {
    const newRecord = snapshot.data();
    const { petId } = context.params;
    const petName = await getPetName(petId);

    const newRecordMessage = createNotificationMessage(
      "New Pet Record Added for " + petName,
      `There is a new record added for ${petName} with a specific dispense amount value of ${
        newRecord.amount
      }. 
        \nMore Details: \n${formatPetRecord(newRecord)}`
    );

    try {
      await admin.firestore().collection("notifications").add({
        title: newRecordMessage.title,
        body: newRecordMessage.body,
        petName: petName,
        timestamp: newRecordMessage.timestamp,
      });
    } catch (error) {
      console.error(
        "Error sending new pet record notification:",
        error.message,
        error.stack
      );
    }
  });

// Function to format feeding information data into a readable string
function formatFeedingInfo(feedingInfo) {
  return `Scheduled Date: ${feedingInfo.scheduledDate}\nScheduled Time: ${feedingInfo.scheduledTime}\nAmount to Feed: ${feedingInfo.amountToFeed} 
    \nRER: ${feedingInfo.RER} \nMER: ${feedingInfo.MER} \nFood Name: ${feedingInfo.foodSelectedName} & Calories Per Gram: ${feedingInfo.caloriesPerGram}`;
}

// Function to send notification on new feeding information added
exports.sendNotificationOnLatestFeedingInfo = functions
  .region(region)
  .firestore.document("pets/{petId}/feedingInformations/{feedingInfoId}")
  .onCreate(async (snapshot, context) => {
    const newFeedingInfo = snapshot.data();
    const { petId } = context.params;
    const petName = await getPetName(petId);

    const newFeedingInfoMessage = createNotificationMessage(
      "New Feeding Schedule Added for " + petName,
      `A new feeding schedule has been made for ${petName} with\n${formatFeedingInfo(
        newFeedingInfo
      )}.`
    );

    try {
      await admin.firestore().collection("notifications").add({
        title: newFeedingInfoMessage.title,
        body: newFeedingInfoMessage.body,
        petName: petName,
        timestamp: newFeedingInfoMessage.timestamp,
      });

      // Fetch pet food amount status
      const food1Doc = await admin
        .firestore()
        .collection("petFoodAmountStatus")
        .doc("food1")
        .get();
      const food2Doc = await admin
        .firestore()
        .collection("petFoodAmountStatus")
        .doc("food2")
        .get();

      const food1Percentage = food1Doc.exists ? food1Doc.data().percentage : 0;
      const food2Percentage = food2Doc.exists ? food2Doc.data().percentage : 0;

      let food1Status;
      if (food1Percentage > 75) {
        food1Status = "Full";
      } else if (food1Percentage > 50) {
        food1Status = "Good";
      } else if (food1Percentage > 25) {
        food1Status = "Low";
      } else {
        food1Status = "Empty";
      }

      let food2Status;
      if (food2Percentage > 75) {
        food2Status = "Full";
      } else if (food2Percentage > 50) {
        food2Status = "Good";
      } else if (food2Percentage > 25) {
        food2Status = "Low";
      } else {
        food2Status = "Empty";
      }

      const foodStatusMessage = `Current Food Status: \nFood 1: ${food1Percentage}% - ${food1Status}\nFood 2: ${food2Percentage}% - ${food2Status}`;

      const foodStatusNotification = createNotificationMessage(
        "Pet Food Amount Status",
        foodStatusMessage
      );

      await admin.firestore().collection("notifications").add({
        title: foodStatusNotification.title,
        body: foodStatusNotification.body,
        petName: petName,
        timestamp: foodStatusNotification.timestamp,
      });
    } catch (error) {
      console.error(
        "Error sending new feeding information notification:",
        error.message,
        error.stack
      );
    }
  });

exports.sendNotificationOnWeightChange = functions
  .region(region)
  .firestore.document("pets/{petId}/records/{recordId}")
  .onCreate(async (snapshot, context) => {
    const currentRecord = snapshot.data();
    const { petId } = context.params;
    const petName = await getPetName(petId);

    // Retrieve the latest record's weight
    const currentWeight = currentRecord.weight;

    // Retrieve the pet's weight from the pet document
    const petRef = admin.firestore().doc(`pets/${petId}`);
    const petSnapshot = await petRef.get();
    if (!petSnapshot.exists) {
      console.log("Pet document does not exist");
      return;
    }
    const petData = petSnapshot.data();
    const petWeight = petData.weight; // Assuming the pet document has a weight field

    // Compare the weights
    const weightDifference = currentWeight - petWeight;
    if (Math.abs(weightDifference) >= 0.5) {
      const direction = weightDifference > 0 ? "increased" : "decreased";
      const weightChangeMessage = createNotificationMessage(
        `Weight Alert: ${petName}'s weight has ${direction}`,
        `The weight of your pet ${petName} has ${direction} by ${Math.abs(
          weightDifference
        )}kg. Consider adjusting their diet and consult a veterinarian as needed.`
      );

      try {
        await admin.firestore().collection("notifications").add({
          title: weightChangeMessage.title,
          body: weightChangeMessage.body,
          petName: petName,
          timestamp: weightChangeMessage.timestamp,
        });
      } catch (error) {
        console.error(
          "Error sending weight change notification:",
          error.message,
          error.stack
        );
      }
    }
  });
