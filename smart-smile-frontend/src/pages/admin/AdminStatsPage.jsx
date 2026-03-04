import { useEffect, useState } from "react";
import { getStats } from "../../api/statsService";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Statistika sistema
        </h2>
        <p className="text-slate-500">Pregled termina, slotova i tretmana</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Ukupno slotova"
          value={stats.slots_total}
          icon={<Calendar size={20} />}
        />
        <StatCard
          title="Zauzeti slotovi"
          value={stats.slots_occupied}
          icon={<XCircle size={20} />}
        />
        <StatCard
          title="Slobodni slotovi"
          value={stats.slots_available}
          icon={<CheckCircle size={20} />}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-lg">Zauzetost termina</h3>

        {stats.slots_chart.labels.map((label, index) => {
          const value = stats.slots_chart.data[index];
          const percent = (value / stats.slots_total) * 100 || 0;

          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{label}</span>
                <span>{value}</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-lg">
          Najčešći tretmani (završeni pregledi)
        </h3>

        {stats.treatments_count.length === 0 ? (
          <p className="text-slate-500">Još uvek nema završenih tretmana.</p>
        ) : (
          <ul className="space-y-2">
            {stats.treatments_count.map((t) => (
              <li
                key={t.treatment__service_name}
                className="flex justify-between text-sm text-slate-700"
              >
                <span>{t.treatment__service_name || "Nepoznat tretman"}</span>
                <span className="font-medium">{t.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-lg">Pregledi u poslednjih 7 dana</h3>

        {stats.appointments_by_day_chart.labels.length === 0 ? (
          <p className="text-slate-500">Nema pregleda u poslednjih 7 dana.</p>
        ) : (
          <ul className="space-y-2">
            {stats.appointments_by_day_chart.labels.map((date, index) => (
              <li
                key={date}
                className="flex justify-between text-sm text-slate-700"
              >
                <span>{date}</span>
                <span className="font-medium">
                  {stats.appointments_by_day_chart.data[index]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-blue-100 text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
