import { useState } from "react";
// import { ref, onValue, off } from "firebase/database";
// import { realtimeDatabase } from "../../config/firebase";
import { PiVideoCameraSlashThin } from "react-icons/pi";

const CameraStream = () => {
  // const [esp32Ip, setEsp32Ip] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [petnessPalCamIP] = useState(
    "https://duly-still-mongrel.ngrok-free.app"
  );

  // useEffect(() => {
  //   const ipRef = ref(realtimeDatabase, "/petnesspalCam/cam1");

  //   const handleIpUpdate = (snapshot) => {
  //     const cam1 = snapshot.val();
  //     setEsp32Ip(ip);
  //   };

  //   onValue(ipRef, handleIpUpdate);

  //   // Cleanup listener on component unmount
  //   return () => off(ipRef, "value", handleIpUpdate);
  // }, []);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  return (
    <div>
      <h1>Camera Stream</h1>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>
      {isCameraOn ? (
        <img
          className="rounded-full shadow-lg max-[440px]:w-fit"
          style={{
            display: "block",
            WebkitUserSelect: "none",
            margin: "auto",
            backgroundColor: "hsl(0, 0%, 25%)",
          }}
          // src={`http://${esp32Ip}:49152`}
          src={petnessPalCamIP}
          alt="PetnessPal Camera"
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <PiVideoCameraSlashThin size="5em" />
        </div>
      )}
    </div>
  );
};

export default CameraStream;
