/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-url",
});

const region = "asia-southeast1";

// Simple cache object with a time-to-live (TTL) mechanism
const petNameCache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Helper function to get pet name from Firestore with caching
async function getPetName(petId) {
  const cached = petNameCache[petId];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.name;
  }
  const petDoc = await admin.firestore().collection("pets").doc(petId).get();
  const petName = petDoc.data().name;
  petNameCache[petId] = {name: petName, timestamp: Date.now()};
  return petName;
}

// Function to send notification on new pet added
exports.sendNotificationOnNewPet = functions.region(region).firestore
    .document("pets/{petId}")
    .onCreate(async (snapshot, context) => {
      const newPet = snapshot.data();
      const newPetMessage = {
        notification: {
          title: "New Pet Added",
          body: `Name: ${newPet.name}`,
        },
        topic: "new-pet-topic",
      };

      try {
        await admin.messaging().send(newPetMessage);
        await admin.firestore().collection("notifications").add({
          title: newPetMessage.notification.title,
          body: newPetMessage.notification.body,
          petName: newPet.name,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error("Error sending new pet notification:", error.message, error.stack);
      }
    });

// Function to send notification on new pet record added
exports.sendNotificationOnNewPetRecord = functions.region(region).firestore
    .document("pets/{petId}/records/{recordId}")
    .onCreate(async (snapshot, context) => {
      const newRecord = snapshot.data();
      const {petId} = context.params;
      const petName = await getPetName(petId);
      const newRecordMessage = {
        notification: {
          title: "New Pet Record Added",
          body: `Record for ${petName}: ${JSON.stringify(newRecord)}`,
        },
        topic: "new-record-topic",
      };

      try {
        await admin.messaging().send(newRecordMessage);
        await admin.firestore().collection("notifications").add({
          title: newRecordMessage.notification.title,
          body: newRecordMessage.notification.body,
          petName: petName,
          recordData: newRecord,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error("Error sending new pet record notification:", error.message, error.stack);
      }
    });

// Function to send notification on new feeding information added
exports.sendNotificationOnLatestFeedingInfo = functions.region(region).firestore
    .document("pets/{petId}/feedingInformations/{feedingInfoId}")
    .onCreate(async (snapshot, context) => {
      const newFeedingInfo = snapshot.data();
      const {petId} = context.params;
      const petName = await getPetName(petId);
      const newFeedingInfoMessage = {
        notification: {
          title: "New Feeding Information",
          body: `Feeding info for ${petName}: ${JSON.stringify(newFeedingInfo)}`,
        },
        topic: "new-feeding-info-topic",
      };

      try {
        await admin.messaging().send(newFeedingInfoMessage);
        await admin.firestore().collection("notifications").add({
          title: newFeedingInfoMessage.notification.title,
          body: newFeedingInfoMessage.notification.body,
          petName: petName,
          feedingInfoData: newFeedingInfo,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error("Error sending new feeding information notification:", error.message, error.stack);
      }
    });
