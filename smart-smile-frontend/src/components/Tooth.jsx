export default function Tooth({ number, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-lg border border-slate-300 bg-white
                 hover:bg-blue-50 hover:border-blue-400 transition
                 flex items-center justify-center text-sm font-medium text-slate-700"
      title={`Zub ${number}`}
    >
      {number}
    </button>
  );
}
