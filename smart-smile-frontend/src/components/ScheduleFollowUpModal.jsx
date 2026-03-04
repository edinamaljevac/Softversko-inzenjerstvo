import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getMySlots } from "../api/slotService";
import { createAppointmentAsDentist } from "../api/appointmentService";
import CreateSlotForm from "./CreateSlotForm";

export default function ScheduleFollowUpModal({
  patientId,
  appointmentId,
  treatmentId,
  onClose,
  onSuccess,
}) {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSlots() {
      try {
        const data = await getMySlots();
        setSlots(data.filter((s) => s.is_available));
      } catch {
        setError("Greška prilikom učitavanja termina.");
      }
    }
    fetchSlots();
  }, []);

  async function handleSchedule() {
    if (!selectedSlotId) return;

    setLoading(true);
    setError("");

    try {
      await createAppointmentAsDentist({
        patient: patientId,
        slot: selectedSlotId,
        treatment: treatmentId || null,
        parent_appointment: appointmentId,
      });

      onSuccess();
    } catch {
      setError("Greška prilikom zakazivanja termina.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-xl
          w-full max-w-lg
          max-h-[90vh] overflow-y-auto
          p-4 sm:p-6
          relative
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4">Zakaži kontrolni termin</h3>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {/* SLOTS */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Izaberite slobodan termin</p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {slots.length === 0 && (
              <p className="text-sm text-slate-500">
                Trenutno nema slobodnih termina.
              </p>
            )}

            {slots.map((slot) => (
              <label
                key={slot.id}
                className={`
                  flex items-center gap-3
                  p-3 border rounded-lg cursor-pointer
                  transition
                  ${
                    selectedSlotId === slot.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={selectedSlotId === slot.id}
                  onChange={() => setSelectedSlotId(slot.id)}
                />
                <span className="text-sm">
                  {slot.date} {slot.start_time.slice(0, 5)} –{" "}
                  {slot.end_time.slice(0, 5)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* CREATE SLOT */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            Nemate odgovarajući termin?
          </p>

          <CreateSlotForm
            onSuccess={(newSlot) => {
              setSlots((prev) => [...prev, newSlot]);
              setSelectedSlotId(newSlot.id);
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            Otkaži
          </button>

          <button
            onClick={handleSchedule}
            disabled={!selectedSlotId || loading}
            className="
              bg-blue-600 hover:bg-blue-700
              text-white px-4 py-2 rounded-lg
              text-sm
              disabled:opacity-50
            "
          >
            {loading ? "Zakazivanje..." : "Zakaži termin"}
          </button>
        </div>
      </div>
    </div>
  );
}
