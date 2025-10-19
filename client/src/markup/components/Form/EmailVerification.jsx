// EmailVerification.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (token && email) {
      axios
        .post("http://localhost:8080/api/verify-email", { token, email })
        .then((response) => {
          setStatus("Email verified successfully!");
        })
        .catch((error) => {
          console.error(error);
          setStatus("Verification failed or link expired.");
        });
    } else {
      setStatus("Invalid verification link.");
    }
  }, [token, email]);

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to right, #36D1DC, #5B86E5)",
          padding: 12,
          textAlign: "center", 
        }}
      >
        
        <h1
          style={{ color: "white", margin: 0, fontSize: 28, fontWeight: 500 }}
        >
          Welcome to EasyLean!
        </h1>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: 35,
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ fontSize: 18, color: "#5B86E5" }}>
           
          <h2>{status}</h2>
        </p>
        
      </div>
      
    </div>
  );
};

export default EmailVerification;
