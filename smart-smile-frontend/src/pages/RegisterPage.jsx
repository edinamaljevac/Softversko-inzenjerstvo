import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { register } from "../api/authService";
import EmailVerificationModal from "../components/EmailVerificationModal";

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  phone: "",
  role: "PATIENT",
};

export default function RegisterPage() {
  const [enteredValues, setEnteredValues] = useState(initialValues);
  const [passwordError, setPasswordError] = useState("");
  const [backendErrors, setBackendErrors] = useState({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  function handleInputChange(identifier, value) {
    setEnteredValues((prev) => ({
      ...prev,
      [identifier]: value,
    }));

    setBackendErrors({});
    if (identifier === "password" || identifier === "confirm_password") {
      setPasswordError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordError("");
    setBackendErrors({});

    if (enteredValues.password !== enteredValues.confirm_password) {
      setPasswordError("Lozinke se ne poklapaju.");
      return;
    }

    const { confirm_password, ...dataForBackend } = enteredValues;

    try {
      await register(dataForBackend);
      setEnteredValues(initialValues);
      setShowVerificationModal(true);
    } catch (error) {
      if (error.response?.data) {
        setBackendErrors(error.response.data);
      } else {
        alert("Greška: backend ne odgovara.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Napravite svoj SmartSmile nalog
          </h3>
          <p className="text-slate-600 mb-8 text-sm md:text-base">
            Pridružite se našoj platformi.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Korisničko ime
              </label>
              <input
                type="text"
                value={enteredValues.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {backendErrors.username && (
                <p className="text-red-600 text-sm">
                  {backendErrors.username[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={enteredValues.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {backendErrors.email && (
                <p className="text-red-600 text-sm">{backendErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Telefon (opciono)
              </label>
              <input
                type="text"
                value={enteredValues.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
                value={enteredValues.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full rounded-xl border px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                ${passwordError ? "border-red-500" : "border-slate-300"}`}
              />
              {backendErrors.password && (
                <p className="text-red-600 text-sm">
                  {backendErrors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Potvrdite lozinku
              </label>
              <input
                type="password"
                value={enteredValues.confirm_password}
                onChange={(e) =>
                  handleInputChange("confirm_password", e.target.value)
                }
                className={`w-full rounded-xl border px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                ${passwordError ? "border-red-500" : "border-slate-300"}`}
              />
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1 text-sm font-medium">
                Uloga
              </label>
              <select
                value={enteredValues.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="PATIENT">Pacijent</option>
                <option value="DENTIST">Stomatolog</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700
                         text-white rounded-xl px-4 py-3 mt-4
                         transition font-medium"
            >
              Registruj se
            </button>
          </form>

          <div className="text-center mt-6 text-slate-600 text-sm">
            Imate nalog?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Prijavite se
            </Link>
          </div>
        </div>
      </div>
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
        }}
      />
    </div>
  );
}
