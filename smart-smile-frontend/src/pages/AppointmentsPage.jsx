import { useRole } from "../hooks/useRole";
import DentistAppointmentsPage from "./DentistAppointmentsPage";
import PatientAppointmentsPage from "./PatientAppointmentsPage";

export default function AppointmentsPage() {
  const { isDentist } = useRole();

  if (isDentist) {
    return <DentistAppointmentsPage />;
  }

  return <PatientAppointmentsPage />;
}
