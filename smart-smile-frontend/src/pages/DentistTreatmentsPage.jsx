import { useEffect, useState } from "react";
import {
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from "../api/treatmentService";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function DentistTreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);

  const [form, setForm] = useState({
    service_name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getTreatments();
      setTreatments(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  function resetForm() {
    setEditing(null);
    setForm({ service_name: "", description: "", price: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.service_name) return;

    if (editing) {
      const updated = await updateTreatment(editing.id, form);
      setTreatments((prev) =>
        prev.map((t) => (t.id === editing.id ? updated : t)),
      );
    } else {
      const created = await createTreatment(form);
      setTreatments((prev) => [...prev, created]);
    }

    resetForm();
  }

  async function confirmDeleteTreatment() {
    await deleteTreatment(treatmentToDelete.id);
    setTreatments((prev) => prev.filter((t) => t.id !== treatmentToDelete.id));
    setTreatmentToDelete(null);
  }

  function startEdit(t) {
    setEditing(t);
    setForm({
      service_name: t.service_name,
      description: t.description || "",
      price: t.price || "",
    });
  }

  if (loading)
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje tretmana...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Upravljanje tretmanima
        </h2>
        <p className="text-slate-500">
          Dodavanje i izmena stomatoloških usluga
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
      >
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Plus size={18} />
          {editing ? "Izmeni tretman" : "Dodaj novi tretman"}
        </h3>

        <input
          type="text"
          placeholder="Naziv usluge"
          value={form.service_name}
          onChange={(e) => setForm({ ...form, service_name: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          required
        />

        <textarea
          placeholder="Opis (opciono)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Cena (opciono)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto">
            {editing ? "Sačuvaj izmene" : "Dodaj"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 w-full sm:w-auto"
            >
              Otkaži
            </button>
          )}
        </div>
      </form>

      {/* LISTA */}
      <>
        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 text-left">Naziv</th>
                <th className="p-4 text-left">Cena</th>
                <th className="p-4 text-right">Akcije</th>
              </tr>
            </thead>

            <tbody>
              {treatments.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-800">
                      {t.service_name}
                    </div>
                    {t.description && (
                      <div className="text-xs text-slate-500">
                        {t.description}
                      </div>
                    )}
                  </td>

                  <td className="p-4">{t.price ? `${t.price} din` : "—"}</td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Izmeni"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => setTreatmentToDelete(t)}
                      className="text-red-600 hover:text-red-800"
                      title="Obriši"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {treatments.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-slate-500">
                    Nema unetih tretmana.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {treatments.length === 0 ? (
            <p className="text-slate-500 text-center">Nema unetih tretmana.</p>
          ) : (
            treatments.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
              >
                <div className="font-medium text-slate-800">
                  {t.service_name}
                </div>

                {t.description && (
                  <div className="text-sm text-slate-500">{t.description}</div>
                )}

                <div className="text-sm text-slate-700">
                  Cena: {t.price ? `${t.price} din` : "—"}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => startEdit(t)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Edit2 size={14} /> Izmeni
                  </button>

                  <button
                    onClick={() => setTreatmentToDelete(t)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} /> Obriši
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>

      <ConfirmModal
        open={!!treatmentToDelete}
        title="Brisanje tretmana"
        message={`Da li ste sigurni da želite da obrišete tretman "${treatmentToDelete?.service_name}"?`}
        onCancel={() => setTreatmentToDelete(null)}
        onConfirm={confirmDeleteTreatment}
      />
    </div>
  );
}
