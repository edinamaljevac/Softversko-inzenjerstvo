import { useState } from "react";
import { createRating } from "../api/ratingService";
import { Star, X } from "lucide-react";

export default function RateAppointmentModal({
  appointmentId,
  onClose,
  onSuccess,
}) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (score === 0) {
      setError("Molimo izaberite ocenu.");
      return;
    }

    try {
      setLoading(true);

      await createRating({
        appointment: appointmentId,
        score,
        comment,
      });

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.appointment?.[0] ||
          err.response?.data?.detail ||
          "Greška prilikom slanja ocene.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3 sm:px-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-2xl
          w-full max-w-md
          max-h-[90vh] overflow-y-auto
          p-4 sm:p-6
          relative
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg sm:text-xl font-semibold mb-5">
          Ocenite pregled
        </h3>

        <label className="block text-sm font-medium mb-2">Vaša ocena</label>

        <div className="flex gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setScore(n)}
              className="text-yellow-400"
            >
              <Star
                size={32}
                className="sm:w-7 sm:h-7"
                fill={n <= score ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">Vaš komentar</label>

        <textarea
          placeholder="Podelite Vaše iskustvo..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="
            w-full bg-slate-100 rounded-xl
            p-3 text-sm resize-none
            mb-3
          "
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full bg-blue-600 hover:bg-blue-700
            text-white py-3 rounded-xl
            font-medium
            disabled:opacity-50
          "
        >
          {loading ? "Slanje..." : "Pošalji ocenu"}
        </button>
      </form>
    </div>
  );
}
