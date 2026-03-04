import { useEffect, useState } from "react";
import {
  createPatientProfile,
  updatePatientProfile,
} from "../api/profileService";

const emptyValues = {
  date_of_birth: "",
  gender: "",
  address: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  medical_notes: "",
};

export default function PatientProfileForm({
  mode = "create",
  initialData = null,
  onSuccess,
}) {
  const [values, setValues] = useState(emptyValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setValues({
        date_of_birth: initialData.date_of_birth || "",
        gender: initialData.gender || "",
        address: initialData.address || "",
        emergency_contact_name: initialData.emergency_contact_name || "",
        emergency_contact_phone: initialData.emergency_contact_phone || "",
        medical_notes: initialData.medical_notes || "",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response =
        mode === "edit"
          ? await updatePatientProfile(values)
          : await createPatientProfile(values);

      onSuccess(response);
    } catch (err) {
      setError("Došlo je do greške prilikom čuvanja profila.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
    >
      <h3 className="text-xl font-semibold">
        {mode === "edit" ? "Izmeni profil" : "Kreirajte profil"}
      </h3>

      <div>
        <label className="block text-slate-700 mb-1">Datum rođenja</label>
        <input
          type="date"
          name="date_of_birth"
          value={values.date_of_birth}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-slate-700 mb-1">Pol</label>
        <select
          name="gender"
          value={values.gender}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Izaberite</option>
          <option value="M">Muški</option>
          <option value="F">Ženski</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-700 mb-1">Adresa</label>
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-slate-700 mb-1">
          Ime za hitni kontakt
        </label>
        <input
          type="text"
          name="emergency_contact_name"
          value={values.emergency_contact_name}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-slate-700 mb-1">
          Telefon za hitni kontakt
        </label>
        <input
          type="text"
          name="emergency_contact_phone"
          value={values.emergency_contact_phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-slate-700 mb-1">Medicinske napomene</label>
        <textarea
          name="medical_notes"
          value={values.medical_notes}
          onChange={handleChange}
          rows={4}
          placeholder="Alergije, hronične bolesti, terapije, posebne napomene..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 resize-none"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-60"
      >
        {loading ? "Čuvanje..." : "Sačuvaj profil"}
      </button>
    </form>
  );
}
