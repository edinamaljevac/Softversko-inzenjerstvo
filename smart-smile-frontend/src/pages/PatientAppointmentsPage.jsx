import { useEffect, useMemo, useState } from "react";
import {
  getMyAppointments,
  updateAppointmentStatus,
} from "../api/appointmentService";
import { getDentistProfileById } from "../api/profileService";
import RateAppointmentModal from "../components/RateAppointmentModal";

import { Calendar, Clock, User, Stethoscope, XCircle, Eye } from "lucide-react";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rateAppointmentId, setRateAppointmentId] = useState(null);

  const [doctorFilter, setDoctorFilter] = useState("all");
  const [treatmentFilter, setTreatmentFilter] = useState("all");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getMyAppointments();
        setAppointments(data);
      } catch {
        setError("Greška prilikom učitavanja pregleda.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  async function handleCancel(id) {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da otkažete ovaj termin?",
    );
    if (!confirmed) return;

    try {
      const updated = await updateAppointmentStatus(id, "canceled");
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      alert("Ne možete otkazati ovaj termin.");
    }
  }

  async function handleViewDoctorProfile(doctorId) {
    try {
      setDoctorLoading(true);
      const data = await getDentistProfileById(doctorId);
      setSelectedDoctor(data);
    } catch {
      alert("Greška prilikom učitavanja profila doktora.");
    } finally {
      setDoctorLoading(false);
    }
  }

  const doctors = useMemo(() => {
    return Array.from(new Set(appointments.map((a) => a.doctor_name)));
  }, [appointments]);

  const treatments = useMemo(() => {
    return Array.from(
      new Set(appointments.map((a) => a.treatment_name).filter(Boolean)),
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const doctorMatch =
        doctorFilter === "all" || a.doctor_name === doctorFilter;

      const treatmentMatch =
        treatmentFilter === "all" || a.treatment_name === treatmentFilter;

      return doctorMatch && treatmentMatch;
    });
  }, [appointments, doctorFilter, treatmentFilter]);

  if (loading)
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje pregleda...
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Moji pregledi</h2>
        <p className="text-slate-500">Pregled svih Vaših zakazanih termina</p>
      </div>

      {/* FILTERI */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="all">Svi doktori</option>
          {doctors.map((doc) => (
            <option key={doc} value={doc}>
              Dr. {doc}
            </option>
          ))}
        </select>

        <select
          value={treatmentFilter}
          onChange={(e) => setTreatmentFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="all">Sve usluge</option>
          {treatments.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <p className="text-slate-500">Nema pregleda za izabrane filtere.</p>
        ) : (
          filteredAppointments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl p-5
                         flex flex-col sm:flex-row
                         sm:items-center sm:justify-between
                         gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* INFO */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <User size={16} className="text-slate-400" />
                  <span>Dr. {a.doctor_name}</span>

                  <button
                    onClick={() => handleViewDoctorProfile(a.doctor)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
                    title="Vidi profil doktora"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {a.slot_date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {a.slot_start_time.slice(0, 5)} –{" "}
                    {a.slot_end_time.slice(0, 5)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Stethoscope size={14} />
                    {a.treatment_name || "—"}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    a.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status === "scheduled"
                    ? "Zakazano"
                    : a.status === "completed"
                      ? "Završeno"
                      : "Otkazano"}
                </span>

                {a.status === "scheduled" && (
                  <button
                    onClick={() => handleCancel(a.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    title="Otkaži termin"
                  >
                    <XCircle size={18} />
                  </button>
                )}

                {a.status === "completed" && !a.has_rating && (
                  <button
                    onClick={() => setRateAppointmentId(a.id)}
                    className="text-yellow-600 hover:underline text-sm"
                  >
                    Oceni pregled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* DOCTOR MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-2">
              Dr. {selectedDoctor.user.username}
            </h3>

            <p className="text-sm text-slate-600 mb-2">
              Telefon: {selectedDoctor.user.phone || "N/A"}
            </p>

            <p className="text-sm text-slate-600 mb-2">
              Specijalizacija:{" "}
              {selectedDoctor.specialization || "Nije navedeno"}
            </p>

            <p className="text-sm text-slate-600 mb-2">
              Biografija:{" "}
              {selectedDoctor.biography || "Nema dodatnih informacija."}
            </p>

            <p className="text-sm text-slate-600">
              Godine iskustva:{" "}
              {selectedDoctor.experience_years || "Nema dodatnih informacija."}
            </p>
          </div>
        </div>
      )}

      {rateAppointmentId && (
        <RateAppointmentModal
          appointmentId={rateAppointmentId}
          onClose={() => setRateAppointmentId(null)}
          onSuccess={() => {
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === rateAppointmentId ? { ...a, has_rating: true } : a,
              ),
            );
            setRateAppointmentId(null);
          }}
        />
      )}
    </div>
  );
}
