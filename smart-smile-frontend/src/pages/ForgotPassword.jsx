import { useState } from "react";
import { forgotPassword } from "../api/authService";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await forgotPassword(email);
      setMessage(data.detail);
    } catch (err) {
      setError(err.response?.data?.detail || "Došlo je do greške.");
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center px-4 bg-slate-50 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Reset lozinke
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Unesite email adresu na koju ćemo poslati link za reset lozinke.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >
              Pošalji link
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
