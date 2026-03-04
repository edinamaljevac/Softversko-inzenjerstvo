import { useEffect, useState } from "react";
import { getTreatments } from "../api/treatmentService";
import { createToothRecord } from "../api/toothRecordService";
import { X } from "lucide-react";
import ScheduleFollowUpModal from "./ScheduleFollowUpModal";

export default function ToothRecordModal({
  toothNumber,
  appointmentId,
  patientId,
  records = [],
  onClose,
  onSuccess,
}) {
  const [treatments, setTreatments] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    async function fetchTreatments() {
      const data = await getTreatments();
      setTreatments(data);
    }
    fetchTreatments();
  }, []);

  async function handleSave() {
    if (!appointmentId) return;

    setLoading(true);
    try {
      await createToothRecord({
        appointment: appointmentId,
        tooth_number: toothNumber,
        treatment: treatmentId || null,
        note,
      });
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl p-6 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>

          <h3 className="text-lg font-semibold mb-4">Zub {toothNumber}</h3>

          {appointmentId && (
            <>
              <select
                value={treatmentId}
                onChange={(e) => setTreatmentId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3"
              >
                <option value="">Izaberite tretman</option>
                {treatments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.service_name}
                  </option>
                ))}
              </select>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Napomena..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4"
              />

              <div className="flex justify-between items-center gap-2 mb-4">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Zakaži novi termin
                </button>

                <div className="flex gap-2">
                  <button onClick={onClose}>Otkaži</button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    {loading ? "Čuvanje..." : "Sačuvaj"}
                  </button>
                </div>
              </div>
            </>
          )}

          {records.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold mb-2">Istorija zahvata</h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {records.map((r) => (
                  <li key={r.id} className="border rounded-lg p-2 text-sm">
                    <p className="font-medium">
                      {r.treatment_name || "Bez tretmana"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    {r.note && <p className="mt-1 text-slate-600">{r.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Nema prethodnih intervencija za ovaj zub.
            </p>
          )}
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleFollowUpModal
          patientId={patientId}
          appointmentId={appointmentId}
          treatmentId={treatmentId}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
