import { useEffect, useState } from "react";
import {
  createDentistProfile,
  updateDentistProfile,
} from "../api/profileService";

const emptyValues = {
  specialization: "",
  experience_years: "",
  biography: "",
  phone_clinic: "",
  clinic_address: "",
};

export default function DentistProfileForm({
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
        specialization: initialData.specialization || "",
        experience_years: initialData.experience_years || "",
        biography: initialData.biography || "",
        phone_clinic: initialData.phone_clinic || "",
        clinic_address: initialData.clinic_address || "",
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
          ? await updateDentistProfile(values)
          : await createDentistProfile(values);

      onSuccess(response);
    } catch {
      setError("Došlo je do greške prilikom čuvanja profila.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl
                 p-5 md:p-6
                 space-y-4
                 max-w-xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-center md:text-left">
        {mode === "edit" ? "Izmeni profil" : "Napravite svoj profil"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-slate-700 mb-1">Specijalizacija</label>
          <input
            name="specialization"
            value={values.specialization}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1">Godine iskustva</label>
          <input
            type="number"
            name="experience_years"
            value={values.experience_years}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1">
            Telefon ordinacije
          </label>
          <input
            name="phone_clinic"
            value={values.phone_clinic}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-slate-700 mb-1">Adresa ordinacije</label>
          <input
            name="clinic_address"
            value={values.clinic_address}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-slate-700 mb-1">Biografija</label>
          <textarea
            name="biography"
            value={values.biography}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="w-full md:w-auto
                   bg-blue-600 hover:bg-blue-700 text-white
                   px-6 py-2 rounded-lg"
      >
        {loading ? "Čuvanje..." : "Sačuvaj profil"}
      </button>
    </form>
  );
}
