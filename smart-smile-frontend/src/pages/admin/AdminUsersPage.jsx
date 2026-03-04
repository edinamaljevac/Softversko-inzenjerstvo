import { useEffect, useState } from "react";
import { getAllUsers, toggleUserActive } from "../../api/adminService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        setError("Greška prilikom učitavanja korisnika.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const updatedUser = await toggleUserActive(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Greška prilikom izmene statusa korisnika.",
      );
    }
  };

  if (loading) return <p>Učitavanje korisnika...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Korisnici sistema</h2>
        <p className="text-slate-500">
          Pregled svih registrovanih korisnika u sistemu
        </p>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Korisničko ime</th>
              <th className="p-4 text-left">Uloga</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.username}</td>

                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                    {u.role}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {u.is_active ? "Aktivan" : "Deaktiviran"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      u.is_active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {u.is_active ? "Deaktiviraj" : "Aktiviraj"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
          >
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-800">{u.email}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Korisničko ime</p>
              <p className="text-slate-700">{u.username}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                {u.role}
              </span>

              <span
                className={`px-2 py-1 rounded text-xs ${
                  u.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {u.is_active ? "Aktivan" : "Deaktiviran"}
              </span>
            </div>

            <button
              onClick={() => handleToggleStatus(u.id)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                u.is_active
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {u.is_active ? "Deaktiviraj korisnika" : "Aktiviraj korisnika"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
