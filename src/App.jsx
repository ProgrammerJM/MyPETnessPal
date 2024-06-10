import { useState, useEffect } from "react";
import { db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PetsLayout from "./components/PetsLayout";
import Dashboard from "./pages/profile/Dashboard";
import PetProfile from "./pages/profile/PetProfile";
import Notifications from "./pages/profile/Notifications";
import SinglePetProfile from "./pages/profile/SinglePetProfile";
import Settings from "./pages/profile/Settings";
import "./App.css";
import Tank from "./pages/profile/Tank";
import PetUser from "./pages/profile/PetUser";
import NotFound from "./pages/NotFound";
import fetchPetRecords from "./pages/function/PetRecords";

function App() {
  const [petFoodList, setPetFoodList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [petRecords, setPetRecords] = useState([]);

  useEffect(() => {
    // Fetch pet food list from Firestore
    const fetchPetFoodList = async () => {
      try {
        const petFoodCollectionRef = collection(db, "petFoodList");
        const querySnapshot = await getDocs(petFoodCollectionRef);
        const petFoodData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPetFoodList(petFoodData);
      } catch (error) {
        console.error("Error fetching pet food list:", error);
      }
    };

    fetchPetFoodList();
  }, []); // Empty dependency array ensures it runs only once on component mount

  const handlePetListChange = (petData) => {
    setPetList(petData); // Update the petList in the parent component

    // Store the petList data in localStorage
    localStorage.setItem("petList", JSON.stringify(petData));
  };

  const petNames = petList.map((pet) => pet.name);

  useEffect(() => {
    const getPetRecords = async () => {
      const recordsMap = [];
      for (const petName of petNames) {
        const records = await fetchPetRecords(petName);
        recordsMap[petName] = records;
      }
      setPetRecords(recordsMap);
    };

    if (petNames.length) {
      getPetRecords();
    }
  }, [petNames]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/profile" element={<PetsLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="petprofile"
            element={
              <PetProfile
                petFoodList={petFoodList}
                onPetListChange={handlePetListChange}
              />
            }
          />
          <Route
            path="petprofile/:petId"
            element={
              <PetUser
                petList={petList}
                petFoodList={petFoodList}
                petRecords={petRecords}
              />
            }
          />
          <Route path="notifications" element={<Notifications />} />
          <Route path="SinglePetProfile" element={<SinglePetProfile />} />
          <Route path="tank" element={<Tank petFoodList={petFoodList} />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
