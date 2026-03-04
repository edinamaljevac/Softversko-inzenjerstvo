import { useState, useEffect, useMemo } from "react";
import { getPatientsList } from "../api/profileService";
import { useNavigate } from "react-router-dom";

export default function PatientsListPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatientsList();
        setPatients(data);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    if (!search) return patients;

    const query = search.toLowerCase();
    return patients.filter((p) =>
      p.user.username.toLowerCase().includes(query),
    );
  }, [patients, search]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje podataka...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <h2 className="text-2xl font-semibold mb-4">Pacijenti</h2>

      <div className="mb-6 max-w-sm">
        <input
          type="text"
          placeholder="Pretraga po username-u"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-300 rounded-lg
                     px-3 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <p className="text-slate-600">
          Nema pacijenata koji odgovaraju pretrazi.
        </p>
      ) : (
        <>
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Telefon</th>
                  <th className="p-3 text-left">Datum rođenja</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/dashboard/patients/${p.id}`)}
                    className="border-t hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="p-3 font-medium">{p.user.username}</td>
                    <td className="p-3">{p.user.email}</td>
                    <td className="p-3">{p.user.phone || "Nije uneto"}</td>
                    <td className="p-3">{p.date_of_birth || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/dashboard/patients/${p.id}`)}
                className="bg-white border border-slate-200 rounded-xl
                           p-4 space-y-2 cursor-pointer
                           hover:shadow-sm transition"
              >
                <div className="text-lg font-semibold text-slate-800">
                  {p.user.username}
                </div>

                <div className="text-sm text-slate-600">
                  <span className="font-medium">Email:</span> {p.user.email}
                </div>

                <div className="text-sm text-slate-600">
                  <span className="font-medium">Telefon:</span>{" "}
                  {p.user.phone || "Nije uneto"}
                </div>

                <div className="text-sm text-slate-600">
                  <span className="font-medium">Datum rođenja:</span>{" "}
                  {p.date_of_birth || "—"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
