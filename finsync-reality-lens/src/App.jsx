import { useState, useRef, useEffect } from 'react';
import ARScene from './ARScene';
import './App.css';

function App() {
  const [arData, setArData] = useState(null);
  const [status, setStatus] = useState("SCANNER READY");
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(err => console.error(err));
  }, []);

  const handleScan = async (position, rotation) => {
    if (status !== "SCANNER READY" || arData) return;

    // STEP 1: UI Feedback
    setStatus("LOCKING TARGET...");
    
    // Slight delay for "Target Lock" visual effect
    setTimeout(async () => {
      setStatus("ANALYZING OBJECT...");

      // STEP 2: Capture Image
      const canvas = document.createElement('canvas');
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
      }

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "scan.jpg");

        try {
          console.log("🚀 Sending to Backend...");
          
          // STEP 3: REAL API CALL
          // Ensure your Python backend is running on port 8000
          const response = await fetch("http://127.0.0.1:8000/scan", {
            method: "POST",
            body: formData
          });

          if (!response.ok) throw new Error("Backend Error");

          const realData = await response.json();
          console.log("✅ Received:", realData);

          // STEP 4: Update AR
          setArData({
            ...realData,
            position: position,
            rotation: rotation
          });
          setStatus("OBJECT TRACKED");

        } catch (error) {
          console.error("Scanning Error:", error);
          alert("Could not connect to AI Brain. Check console.");
          setStatus("SCAN ERROR");
        }
      }, 'image/jpeg');

    }, 800);
  };

  const resetScan = () => {
    setArData(null);
    setStatus("SCANNER READY");
  };

  return (
    <div className="app-container">
      <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
      
      <div className="ar-layer">
        <ARScene 
          onScan={handleScan} 
          arData={arData} 
          isScanning={status === "LOCKING TARGET..." || status === "ANALYZING OBJECT..."} 
        />
      </div>

      <div className="ui-layer">
        <div className="hud-corners"><div className="hud-corners-2"></div></div>
        
        <div className="header-bar">
          <div className="logo">FinSync_Lens</div>
          <div className="status">SYS: <span>{status}</span></div>
        </div>

        {!arData && (
          <div className={`crosshair ${status === "LOCKING TARGET..." ? "locking" : ""}`}></div>
        )}

        {status === "SCANNER READY" && (
          <div className="scan-prompt">TAP OBJECT TO TRACK</div>
        )}

        {arData && (
          <button className="reset-btn" onClick={resetScan}>TRACK NEW OBJECT</button>
        )}
      </div>
    </div>
  );
}

export default App;