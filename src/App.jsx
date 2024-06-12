import { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "./config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
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
import Help from "./pages/profile/Help";
import Settings from "./pages/profile/Settings";
import "./App.css";
import Tank from "./pages/profile/Tank";
import PetUser from "./pages/profile/PetUser";
import NotFound from "./pages/NotFound";
import fetchPetRecords from "./pages/function/PetRecords";

function App() {
  const [petFoodList, setPetFoodList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [petRecords, setPetRecords] = useState({});
  const petFoodCollectionRef = useMemo(() => collection(db, "petFoodList"), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(petFoodCollectionRef, (snapshot) => {
      const petFoodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPetFoodList(petFoodData);
    });

    return () => unsubscribe();
  }, [petFoodCollectionRef]);

  const handlePetListChange = useCallback((petData) => {
    setPetList(petData);
    localStorage.setItem("petList", JSON.stringify(petData));
  }, []);

  useEffect(() => {
    const getPetRecords = async () => {
      const recordsMap = await Promise.all(
        petList.map(async (pet) => {
          const records = await fetchPetRecords(pet.name);
          return { [pet.name]: records };
        })
      );
      setPetRecords(Object.assign({}, ...recordsMap));
    };

    if (petList.length) {
      getPetRecords();
    }
  }, [petList]);

  console.log(petRecords);

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
          <Route path="Help" element={<Help />} />
          <Route path="tank" element={<Tank petFoodList={petFoodList} />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
