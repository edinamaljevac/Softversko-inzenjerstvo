import { useEffect, useState } from "react";
import { deleteSlot, getMySlots } from "../api/slotService";
import CreateSlotForm from "../components/CreateSlotForm";
import ConfirmModal from "../components/ConfirmModal";
import { Trash2, Calendar, Clock } from "lucide-react";

export default function DentistSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotToDelete, setSlotToDelete] = useState(null);

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

  async function confirmDeleteSlot() {
    await deleteSlot(slotToDelete.id);
    setSlots((prev) => prev.filter((s) => s.id !== slotToDelete.id));
    setSlotToDelete(null);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje termina...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Calendar size={22} />
          Moji termini
        </h2>
        <p className="text-slate-500">
          Upravljajte dostupnim terminima za pacijente
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Dodaj novi termin</h3>
        <CreateSlotForm
          onSuccess={(newSlot) => setSlots((prev) => [...prev, newSlot])}
        />
      </div>

      <>
        <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Vreme</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{slot.date}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={13} className="text-slate-400" />
                      {slot.start_time.slice(0, 5)} –{" "}
                      {slot.end_time.slice(0, 5)}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${
                        slot.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {slot.is_available ? "Slobodan" : "Zauzet"}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSlotToDelete(slot)}
                      disabled={!slot.is_available}
                      title={
                        slot.is_available
                          ? "Obriši termin"
                          : "Termin je zauzet i ne može se obrisati"
                      }
                      className={`inline-flex items-center gap-1 text-sm p-2 rounded-lg transition
                      ${
                        slot.is_available
                          ? "text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          : "text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Trash2 size={16} /> Obriši
                    </button>
                  </td>
                </tr>
              ))}

              {slots.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    Nema unetih termina.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {slots.length === 0 ? (
            <p className="text-slate-500 text-center">Nema unetih termina.</p>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="font-medium">{slot.date}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 text-sm">
                  <Clock size={13} className="text-slate-400" />
                  {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                </div>

                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium
                  ${
                    slot.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {slot.is_available ? "Slobodan" : "Zauzet"}
                </span>

                <button
                  onClick={() => setSlotToDelete(slot)}
                  disabled={!slot.is_available}
                  className={`inline-flex items-center gap-1 text-sm p-2 rounded-lg transition
                  ${
                    slot.is_available
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Trash2 size={16} /> Obriši
                </button>
              </div>
            ))
          )}
        </div>
      </>

      <ConfirmModal
        open={!!slotToDelete}
        title="Brisanje termina"
        message="Da li ste sigurni da želite da obrišete ovaj termin?"
        onCancel={() => setSlotToDelete(null)}
        onConfirm={confirmDeleteSlot}
      />
    </div>
  );
}
