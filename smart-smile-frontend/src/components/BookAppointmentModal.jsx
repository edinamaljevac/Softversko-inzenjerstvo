import { useEffect, useState } from "react";
import { createAppointment } from "../api/appointmentService";
import { getTreatments } from "../api/treatmentService";

export default function BookAppointmentModal({ slot, onClose, onSuccess }) {
  const [treatments, setTreatments] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTreatments() {
      const data = await getTreatments(slot.doctor);
      setTreatments(data);
    }
    fetchTreatments();
  }, [slot.doctor]);

  async function handleSubmit() {
    if (!treatmentId) {
      setError("Molimo izaberite tretman.");
      return;
    }

    try {
      setLoading(true);
      await createAppointment({
        slotId: slot.id,
        treatmentId,
      });
      onSuccess();
    } catch {
      setError("Greška prilikom zakazivanja termina.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Zakazivanje termina</h3>

        <p className="text-sm text-slate-600 mb-4">
          {slot.date} • {slot.start_time.slice(0, 5)} –{" "}
          {slot.end_time.slice(0, 5)}
        </p>

        <select
          value={treatmentId}
          onChange={(e) => {
            setTreatmentId(e.target.value);
            setError("");
          }}
          className="w-full border border-slate-300 rounded-lg
                     px-3 py-2 mb-3 focus:ring-2
                     focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Izaberite tretman</option>
          {treatments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.service_name}
            </option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700
                       text-white px-4 py-2 rounded-lg
                       text-sm font-medium transition"
          >
            {loading ? "Zakazivanje..." : "Potvrdi"}
          </button>
        </div>
      </div>
    </div>
  );
}
