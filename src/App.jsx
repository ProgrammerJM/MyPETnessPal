import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PetProvider } from "./pages/function/PetContext";
import { NotificationProvider } from "./pages/function/NotificationsContext";
import { ThemeContext } from "./pages/function/ThemeContext";
import { useContext } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
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
import Cage from "./pages/profile/Cage";

function App() {
  const { theme } = useContext(ThemeContext); // use ThemeContext

  return (
    <BrowserRouter>
      <div className={theme === "light" ? "light-class" : "dark-class"}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} /> */}
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route
            path="/profile"
            element={
              <PetProvider>
                <NotificationProvider>
                  <PetsLayout />
                </NotificationProvider>
              </PetProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="petprofile" element={<PetProfile />} />
            <Route path="petprofile/:petId" element={<PetUser />} />
            <Route path="cage" element={<Cage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
            <Route path="tank" element={<Tank />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
