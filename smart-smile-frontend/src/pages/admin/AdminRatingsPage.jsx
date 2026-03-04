import { useEffect, useState } from "react";
import { getAllRatingsAdmin, deleteRatingAdmin } from "../../api/ratingService";
import ConfirmModal from "../../components/ConfirmModal";
import { Star, Trash2 } from "lucide-react";

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingToDelete, setRatingToDelete] = useState(null);

  useEffect(() => {
    async function fetchRatings() {
      const data = await getAllRatingsAdmin();
      setRatings(data);
      setLoading(false);
    }
    fetchRatings();
  }, []);

  async function confirmDeleteRating() {
    await deleteRatingAdmin(ratingToDelete.id);
    setRatings((prev) => prev.filter((r) => r.id !== ratingToDelete.id));
    setRatingToDelete(null);
  }

  if (loading) return <p>Učitavanje ocena...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Moderacija ocena</h2>
        <p className="text-slate-500">Pregled i uklanjanje komentara</p>
      </div>

      <div className="space-y-4">
        {ratings.map((r) => (
          <div
            key={r.id}
            className="
              bg-white border border-slate-200 rounded-xl
              p-4 sm:p-5
              flex flex-col sm:flex-row
              sm:justify-between gap-4
            "
          >
            <div className="flex-1 space-y-1">
              <p className="text-sm text-slate-600">
                <strong>Doktor:</strong> Dr. {r.doctor_name} ·{" "}
                <strong>Pacijent:</strong> {r.patient_name}
              </p>

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

              <p className="text-xs text-slate-400 mt-2">
                {new Date(r.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex sm:flex-col justify-end">
              <button
                onClick={() => setRatingToDelete(r)}
                className="
                  text-red-600 hover:bg-red-50
                  p-2 rounded-lg
                  self-end
                "
                title="Obriši ocenu"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!ratingToDelete}
        title="Brisanje ocene"
        message="Da li ste sigurni da želite da obrišete ovu ocenu?"
        onCancel={() => setRatingToDelete(null)}
        onConfirm={confirmDeleteRating}
      />
    </div>
  );
}
