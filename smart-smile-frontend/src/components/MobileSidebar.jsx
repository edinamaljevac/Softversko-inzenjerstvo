import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileSidebar({ open, onClose, menuItems, footer }) {
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

      <aside className="fixed top-0 left-0 h-full w-72 bg-white z-50">
        <div className="flex flex-col h-full">
          <div className="px-4 py-4 border-b border-slate-100 flex justify-between">
            <div className="leading-tight">
              <h1 className="text-blue-600 font-semibold text-xl">
                SmartSmile
              </h1>
              <p className="text-xs text-slate-500">
                Sistem za upravljanje stomatološkim uslugama
              </p>
            </div>

            <button onClick={onClose} className="text-slate-600">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 px-4 py-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className="text-base font-medium text-slate-800"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-4 py-4 text-sm text-slate-400">
            {footer}
          </div>
        </div>
      </aside>
    </>
  );
}
