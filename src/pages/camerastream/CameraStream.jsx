import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { realtimeDatabase } from "../../config/firebase";
import { PiVideoCameraSlashThin } from "react-icons/pi";


const CameraStream = () => {
  const [esp32Ip, setEsp32Ip] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const ipRef = ref(realtimeDatabase, "/esp32/ip");

    const handleIpUpdate = (snapshot) => {
      const ip = snapshot.val();
      setEsp32Ip(ip);
    };

    onValue(ipRef, handleIpUpdate);

    // Cleanup listener on component unmount
    return () => off(ipRef, "value", handleIpUpdate);
  }, []);

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
          className=" rounded-full shadow-lg"
          style={{
            display: "block",
            WebkitUserSelect: "none",
            margin: "auto",
            backgroundColor: "hsl(0, 0%, 25%)",
          }}
          src={`http://${esp32Ip}:8080`}
          alt="ESP32 Camera Stream"
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
