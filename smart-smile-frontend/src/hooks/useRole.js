import { useAuth } from "../context/AuthContext";

export function useRole() {
  const { user } = useAuth();

  return {
    role: user?.role,
    isAdmin: user?.role === "ADMIN",
    isDentist: user?.role === "DENTIST",
    isPatient: user?.role === "PATIENT",
  };
}
