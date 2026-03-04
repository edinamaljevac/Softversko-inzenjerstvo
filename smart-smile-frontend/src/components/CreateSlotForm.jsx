import { useState } from "react";
import { createSlot } from "../api/slotService";

export default function CreateSlotForm({ onSuccess }) {
  const [values, setValues] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (values.start_time >= values.end_time) {
      setError("Vreme početka mora biti pre vremena završetka.");
      return;
    }

    try {
      const slot = await createSlot(values);
      onSuccess(slot);
      setValues({ date: "", start_time: "", end_time: "" });
    } catch (err) {
      const data = err.response?.data;

      if (data?.date) {
        setError(data.date[0]);
      } else if (data?.start_time) {
        setError(data.start_time[0]);
      } else if (data?.end_time) {
        setError(data.end_time[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Greška prilikom dodavanja termina.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white border border-slate-200 rounded-xl
        p-4
        flex flex-col sm:flex-row
        gap-4
        sm:items-end
      "
    >
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-slate-500">Datum</label>
        <input
          type="date"
          value={values.date}
          onChange={(e) => setValues({ ...values, date: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-slate-500">Vreme početka</label>
        <input
          type="time"
          value={values.start_time}
          onChange={(e) =>
            setValues({
              ...values,
              start_time: e.target.value,
            })
          }
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-slate-500">Vreme završetka</label>
        <input
          type="time"
          value={values.end_time}
          onChange={(e) =>
            setValues({
              ...values,
              end_time: e.target.value,
            })
          }
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="
          bg-blue-600 hover:bg-blue-700 text-white
          px-4 py-2 rounded
          w-full sm:w-auto
        "
      >
        Dodaj termin
      </button>

      {error && <p className="w-full text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}
