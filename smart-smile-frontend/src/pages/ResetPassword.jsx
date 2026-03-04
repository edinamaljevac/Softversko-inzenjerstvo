import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authService";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await resetPassword({ uid, token, password });
      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.join(" "));
      } else {
        setError(detail || "Link je neispravan.");
      }
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center px-4 bg-slate-50 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Nova lozinka
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Unesite novu lozinku za Vaš nalog.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >
              Sačuvaj lozinku
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
