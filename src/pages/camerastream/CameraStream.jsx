import { useState, useEffect } from "react";
import { PiVideoCameraSlashThin } from "react-icons/pi";

const CameraStream = () => {
  const [esp32Ip] = useState("192.168.1.17");
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    // Optionally, you can fetch the ESP32 IP from Firebase or some configuration
  }, []);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
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
          src={`http://${esp32Ip}/`}
          alt="ESP32 Camera Stream"
          width="943"
          height="707"
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
