import { useRole } from "../hooks/useRole";

import DentistProfilePage from "./DentistProfilePage";
import ProfilePage from "./ProfilePage";

export default function Profile() {
  const { isDentist } = useRole();

  if (isDentist) {
    return <DentistProfilePage />;
  }

  return <ProfilePage />;
}
