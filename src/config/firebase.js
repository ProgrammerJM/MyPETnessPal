// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPcMRU9x421wP0cS1sRHwEvi57W8NoLiE",
  authDomain: "petness-92c55.firebaseapp.com",
  projectId: "petness-92c55",
  storageBucket: "petness-92c55.appspot.com",
  messagingSenderId: "115182665138",
  appId: "1:115182665138:web:8782a3e937e136897e38ab",
  measurementId: "G-Y0PW9RDDCN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const rtd = getDatabase(app);
// const analytics = getAnalytics(app);
