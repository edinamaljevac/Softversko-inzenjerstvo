import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { getMenuItems } from "../utils/menuConfig";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../hooks/useRole";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const { role } = useRole();
  const [open, setOpen] = useState(false);

  const menuItems = getMenuItems(role);

  return (
    <div className="min-h-screen flex bg-linear-to-b from-blue-50 to-white">
      <Sidebar />

      <div className="flex-1">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 lg:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-blue-600 font-semibold text-xl">SmartSmile</h1>

            <button onClick={() => setOpen(true)} className="text-slate-700">
              <Menu size={22} />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <MobileSidebar
        open={open}
        onClose={() => setOpen(false)}
        menuItems={menuItems}
        footer={
          <button onClick={logout} className="text-red-500 text-sm">
            Logout
          </button>
        }
      />
    </div>
  );
}
