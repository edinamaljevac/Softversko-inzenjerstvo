import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../hooks/useRole";
import { getMenuItems } from "../utils/menuConfig";
import logo from "../assets/logo.png";

export default function SideBar() {
  const { logout } = useAuth();
  const { role } = useRole();

  const menuItems = getMenuItems(role);

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col px-4 py-6">
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SmartSmile logo"
            className="w-9 h-9 object-contain"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-blue-600 font-semibold text-xl">
              SmartSmile
            </span>
            <span className="text-xs text-slate-500">
              Sistem za upravljanje stomatološkim uslugama
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-6 flex items-center text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
}
