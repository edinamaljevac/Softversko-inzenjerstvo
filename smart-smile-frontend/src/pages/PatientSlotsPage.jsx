import { useEffect, useState } from "react";
import { getMySlots } from "../api/slotService";
import { Calendar, Clock, User } from "lucide-react";
import BookAppointmentModal from "../components/BookAppointmentModal";

export default function PatientSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const data = await getMySlots();
        setSlots(data);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje slobodnih termina...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold mb-2">Slobodni termini</h2>
        <p className="text-slate-600">Trenutno nema dostupnih termina.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Slobodni termini
      </h2>
      <p className="text-slate-500 mb-6">
        Izaberite termin koji Vam odgovara i zakažite pregled
      </p>

      <div className="grid gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="bg-white border border-slate-200 rounded-xl p-4
                       flex flex-col sm:flex-row sm:items-center sm:justify-between
                       gap-4 hover:shadow-sm transition"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <User size={16} className="text-slate-400" />
                {slot.doctor_name}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {slot.date}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSlot(slot)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700
                         text-white px-5 py-2 rounded-lg
                         text-sm font-medium transition"
            >
              Zakaži
            </button>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <BookAppointmentModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={() => {
            setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
