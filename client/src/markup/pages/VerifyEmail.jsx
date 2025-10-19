// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const [status, setStatus] = useState("verifying"); // verifying, success, expired, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    async function verify() {
      try {
        const res = await fetch(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8080"
          }/api/auth/verify-email?token=${encodeURIComponent(
            token
          )}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (res.ok) {
          if (
            data.status === "verified" ||
            data.status === "already_verified"
          ) {
            setStatus("success");
            setMessage("Your email has been verified. You can now log in.");
          } else {
            setStatus("error");
            setMessage(data.message || "Verification failed.");
          }
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Server error: " + err.message);
      }
    }
    verify();
  }, [token, email]);

  return (
    <div className="max-w-xl mx-auto p-6">
      {status === "verifying" && <p>Verifying...</p>}
      {status === "success" && <div className="text-green-700">{message}</div>}
      {status === "error" && <div className="text-red-600">{message}</div>}
    </div>
  );
}
