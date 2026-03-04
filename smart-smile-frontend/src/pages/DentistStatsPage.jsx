import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDentistStats } from "../api/statsService";

const STATUS_COLORS = {
  scheduled: "#3b82f6",
  completed: "#22c55e",
  canceled: "#ef4444",
};

const SLOT_COLORS = ["#3b82f6", "#ef4444"];

export default function DentistStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDentistStats();
        setStats(data);
      } catch {
        setError("Greška prilikom učitavanja statistike.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje statistike...
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  const appointmentsStatusData = stats.appointments_count.map((item) => ({
    name:
      item.status === "scheduled"
        ? "Zakazani"
        : item.status === "completed"
          ? "Završeni"
          : "Otkazani",
    value: item.total,
    color: STATUS_COLORS[item.status],
  }));

  const slotsData = [
    { name: "Slobodni", value: stats.slots_available },
    { name: "Zauzeti", value: stats.slots_occupied },
  ];

  const appointmentsByDayData = stats.appointments_by_day_chart.labels.map(
    (label, index) => ({
      date: label,
      total: stats.appointments_by_day_chart.data[index],
    }),
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 md:px-0">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Statistika rada</h2>
        <p className="text-slate-500">
          Pregled Vašeg rada, termina i pregleda u poslednjih 7 dana
        </p>
      </div>

      {/* STATUS PIE */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h3 className="font-semibold text-slate-700 mb-1">
          Pregledi po statusu
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Prikazuje broj pregleda prema trenutnom statusu.
        </p>

        <div className="h-56 md:h-64 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={appointmentsStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ value }) => value}
                labelLine={false}
              >
                {appointmentsStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-4 text-sm">
          {appointmentsStatusData.map((item) => (
            <span key={item.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {/* SLOTS PIE */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h3 className="font-semibold text-slate-700 mb-1">Zauzetost termina</h3>
        <p className="text-sm text-slate-500 mb-6">
          Odnos slobodnih i zauzetih termina u Vašem rasporedu.
        </p>

        <div className="h-56 md:h-64 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slotsData}
                dataKey="value"
                nameKey="name"
                outerRadius={85}
                label={({ value }) => value}
                labelLine={false}
              >
                {slotsData.map((_, index) => (
                  <Cell key={index} fill={SLOT_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            Slobodni termini
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Zauzeti termini
          </span>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h3 className="font-semibold text-slate-700 mb-1">
          Pregledi u poslednjih 7 dana
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Broj pregleda po danima u poslednjih 7 dana.
        </p>

        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={appointmentsByDayData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-sm text-slate-600 mt-4 italic">
          Ovaj grafikon pomaže u praćenju opterećenja i kontinuiteta rada.
        </p>
      </div>
    </div>
  );
}
