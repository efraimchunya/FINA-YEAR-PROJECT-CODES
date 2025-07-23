import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const token = query.get("token");
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage("Verification failed.");
        }
      })
      .catch(() => setMessage("Server error."));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
