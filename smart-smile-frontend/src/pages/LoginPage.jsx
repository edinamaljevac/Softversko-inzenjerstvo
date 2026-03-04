import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { login as loginRequest } from "../api/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleInputChange(identifier, value) {
    setCredentials((prevValues) => ({
      ...prevValues,
      [identifier]: value,
    }));
    setBackendError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBackendError("");

    try {
      const response = await loginRequest(credentials);
      login(response);

      if (response.role === "ADMIN") {
        navigate("/dashboard/admin/users");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const data = error.response?.data;

      if (data?.detail) {
        setBackendError(data.detail);
      } else if (typeof data === "string") {
        setBackendError(data);
      } else {
        setBackendError("Pogrešan email ili lozinka.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Prijavite se na SmartSmile
          </h3>
          <p className="text-slate-600 mb-8 text-sm md:text-base">
            Unesite svoje podatke za prijavu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Unesite email"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Lozinka
              </label>
              <input
                type="password"
                placeholder="Unesite lozinku"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {backendError && (
              <p className="text-red-600 text-sm">{backendError}</p>
            )}

            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Zaboravili ste lozinku?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700
                         text-white rounded-xl px-4 py-3 mt-2
                         transition font-medium"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6 text-slate-600 text-sm">
            Nemate nalog?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Registrujte se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
