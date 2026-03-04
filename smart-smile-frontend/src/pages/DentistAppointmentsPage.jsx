import { useEffect, useMemo, useState } from "react";
import {
  getMyAppointments,
  updateAppointmentStatus,
} from "../api/appointmentService";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function DentistAppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getMyAppointments();
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      alert("Greška prilikom izmene statusa.");
    }
  }

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return {
      today: appointments.filter((a) => a.slot_date === today).length,
      scheduled: appointments.filter((a) => a.status === "scheduled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      canceled: appointments.filter((a) => a.status === "canceled").length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const statusMatch = statusFilter === "all" || a.status === statusFilter;
      const dateMatch = !dateFilter || a.slot_date === dateFilter;
      return statusMatch && dateMatch;
    });
  }, [appointments, statusFilter, dateFilter]);

  const calendarEvents = useMemo(() => {
    return appointments.map((a) => ({
      id: a.id,
      title: `${a.patient_name} – ${a.treatment_name || "Pregled"}`,
      start: `${a.slot_date}T${a.slot_start_time}`,
      end: `${a.slot_date}T${a.slot_end_time}`,
      extendedProps: {
        status: a.status,
        patientId: a.patient,
      },
    }));
  }, [appointments]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje pregleda...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pregled termina</h2>
          <p className="text-slate-500">
            Upravljanje zakazanim terminima pacijenata
          </p>
        </div>

        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg text-sm w-full sm:w-auto ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Lista
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`hidden md:inline-block px-4 py-2 rounded-lg text-sm ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Kalendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Danas" value={stats.today} />
        <StatCard title="Zakazani" value={stats.scheduled} />
        <StatCard title="Završeni" value={stats.completed} />
        <StatCard title="Otkazani" value={stats.canceled} />
      </div>

      {viewMode === "list" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="all">Svi statusi</option>
            <option value="scheduled">Zakazani</option>
            <option value="completed">Završeni</option>
            <option value="canceled">Otkazani</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-sm text-blue-600 hover:underline"
            >
              Prikaži sve datume
            </button>
          )}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="hidden md:block bg-white border border-slate-200 rounded-xl p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents}
            eventClick={(info) => {
              const appointmentId = info.event.id;
              const status = info.event.extendedProps.status;
              const patientId = info.event.extendedProps.patientId;

              if (status === "scheduled") {
                navigate(`/dashboard/patients/${patientId}/${appointmentId}`);
              }
            }}
            eventClassNames={(arg) => {
              const status = arg.event.extendedProps.status;
              if (status === "completed") return ["bg-green-500"];
              if (status === "canceled") return ["bg-red-500"];
              return ["bg-blue-500"];
            }}
            height="auto"
          />
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-slate-500 text-center">
              Nema termina za izabrane filtere.
            </p>
          ) : (
            filteredAppointments.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-slate-200 rounded-xl p-4 md:p-5
                           flex flex-col sm:flex-row sm:justify-between
                           sm:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <User size={16} />
                    {a.patient_name}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {a.slot_date}
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

                <div className="flex flex-wrap items-center gap-3">
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
                    <>
                      <button
                        onClick={async () => {
                          await handleStatusChange(a.id, "completed");
                          navigate(`/dashboard/patients/${a.patient}/${a.id}`);
                        }}
                        title="Završi pregled i unesi uslugu"
                        className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => handleStatusChange(a.id, "canceled")}
                        title="Otkaži termin"
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
        {value}
      </p>
    </div>
  );
}
