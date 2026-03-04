import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";

export default function VerifyEmailPage() {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        await axiosInstance.get(`accounts/verify-email/${uid}/${token}/`);
        setMessage("Email je uspešno potvrđen. Preusmeravanje...");
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setMessage("Link nije validan ili je istekao.");
      }
    }

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">{message}</p>
    </div>
  );
}
