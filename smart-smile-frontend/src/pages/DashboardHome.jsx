import { Calendar, ClipboardList, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 px-4 md:px-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dobrodošli u SmartSmile
        </h1>
        <p className="text-slate-500 mt-1 max-w-2xl">
          Vaš digitalni asistent za zakazivanje i praćenje stomatoloških
          pregleda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Pregledi"
          description="Pregled i upravljanje terminima"
          icon={<Calendar size={22} />}
        />
        <DashboardCard
          title="Moji podaci"
          description="Lični i medicinski podaci"
          icon={<ClipboardList size={22} />}
        />
        <DashboardCard
          title="Usluge"
          description="Pregled dostupnih stomatoloških usluga"
          icon={<HeartPulse size={22} />}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Brzi pristup
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton
            label="Moj profil"
            onClick={() => navigate("/dashboard/profile")}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl
                 p-5 flex items-start gap-4
                 hover:shadow-sm transition"
    >
      <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full sm:w-auto
        px-4 py-2 rounded-lg
        bg-blue-600 text-white text-sm
        hover:bg-blue-700 transition
      "
    >
      {label}
    </button>
  );
}
