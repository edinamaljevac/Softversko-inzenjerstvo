import { useEffect, useMemo, useState } from "react";
import { getRatings } from "../api/ratingService";
import { Star } from "lucide-react";

export default function DentistRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getRatings();
      setRatings(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (ratings.length === 0) {
      return {
        average: 0,
        total: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    ratings.forEach((r) => {
      breakdown[r.score] += 1;
      sum += r.score;
    });

    return {
      average: (sum / ratings.length).toFixed(1),
      total: ratings.length,
      breakdown,
    };
  }, [ratings]);

  if (loading)
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje ocena...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ocene i utisci</h2>
        <p className="text-slate-500">
          Povratne informacije pacijenata o Vašem radu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center">
          <div className="text-4xl md:text-5xl font-bold text-slate-800">
            {stats.average}
          </div>

          <div className="flex gap-1 my-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={22}
                className="text-yellow-400"
                fill={n <= Math.round(stats.average) ? "currentColor" : "none"}
              />
            ))}
          </div>

          <p className="text-sm text-slate-500">
            Na osnovu {stats.total} ocena
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = stats.breakdown[n];
            const percent = stats.total ? (count / stats.total) * 100 : 0;

            return (
              <div key={n} className="flex items-center gap-3">
                <span className="w-6 text-sm">{n}</span>
                <Star
                  size={14}
                  className="text-yellow-400"
                  fill="currentColor"
                />

                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-6 text-sm text-slate-600 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 && (
          <p className="text-slate-500">Još uvek nemate ocene.</p>
        )}

        {ratings.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-sm p-4 md:p-6
                       flex flex-col sm:flex-row gap-4
                       hover:shadow-md transition"
          >
            <div
              className="w-12 h-12 rounded-full bg-blue-100 text-blue-700
                            flex items-center justify-center font-semibold shrink-0"
            >
              {r.patient_name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="font-medium text-slate-800">{r.patient_name}</p>
                <span className="text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={16}
                    className="text-yellow-400"
                    fill={n <= r.score ? "currentColor" : "none"}
                  />
                ))}
              </div>

              {r.comment && (
                <p className="text-slate-700 text-sm mt-2">{r.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
