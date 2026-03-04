import { useRole } from "../hooks/useRole";
import DentistSlotsPage from "./DentistSlotsPage";
import PatientSlotsPage from "./PatientSlotsPage";

export default function SlotsPage() {
  const { isDentist } = useRole();

  if (isDentist) {
    return <DentistSlotsPage />;
  }

  return <PatientSlotsPage />;
}
