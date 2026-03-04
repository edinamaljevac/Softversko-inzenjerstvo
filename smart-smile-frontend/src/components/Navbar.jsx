import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

import logo from "../assets/logo.png";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Registruj se", path: "/register" },
    { name: "Login", path: "/login" },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="SmartSmile logo"
              className="w-9 h-9 object-contain"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-blue-600 font-semibold text-xl">
                SmartSmile
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Sistem za upravljanje stomatološkim uslugama
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex gap-2">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 transition"
            >
              Registruj se
            </Link>

            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 transition"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-slate-700"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileSidebar
        open={open}
        onClose={() => setOpen(false)}
        menuItems={menuItems}
        footer="© 2025 SmartSmile"
      />
    </>
  );
}
