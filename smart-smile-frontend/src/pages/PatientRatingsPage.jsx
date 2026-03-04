import { useEffect, useState, useCallback } from "react";
import { getRatings } from "../api/ratingService";
import { Star } from "lucide-react";

export default function PatientRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRatings = useCallback(async () => {
    try {
      setError("");
      const data = await getRatings();
      setRatings(data);
    } catch {
      setError("Greška prilikom učitavanja ocena.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje ocena...
      </div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Moje ocene</h2>
        <p className="text-slate-500">
          Ocene i komentari koje ste ostavili stomatolozima
        </p>
      </div>

      {ratings.length === 0 && (
        <p className="text-slate-500">Još uvek nemate ostavljene ocene.</p>
      )}

      <div className="space-y-4">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="bg-white rounded-2xl border border-slate-200
                       p-5 md:p-6 transition
                       hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="font-medium text-slate-800">
                Dr. {rating.doctor_name}
              </p>
              <span className="text-xs text-slate-400">
                {new Date(rating.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm text-slate-700">
              <span>Ocena:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    className="text-yellow-400"
                    fill={n <= rating.score ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>

            {rating.comment && (
              <p className="mt-3 text-slate-700 text-sm leading-relaxed">
                {rating.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
