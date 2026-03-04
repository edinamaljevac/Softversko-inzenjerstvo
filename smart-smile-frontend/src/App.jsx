import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import PatientsListPage from "./pages/PatientsListPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import SlotsPage from "./pages/SlotsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DentistTreatmentsPage from "./pages/DentistTreatmentsPage";
import PatientRatingsPage from "./pages/PatientRatingsPage";
import DentistRatingsPage from "./pages/DentistRatingsPage";
import DentistStatsPage from "./pages/DentistStatsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminStatsPage from "./pages/admin/AdminStatsPage";
import Profile from "./pages/Profile";
import AdminRatingsPage from "./pages/admin/AdminRatingsPage";
import VerifyEmailPage from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            <Route path="profile" element={<Profile />} />
            <Route path="patients" element={<PatientsListPage />} />
            <Route path="patients/:id" element={<PatientDetailsPage />} />
            <Route path="slots" element={<SlotsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route
              path="patients/:id/:appointmentId"
              element={<PatientDetailsPage />}
            />
            <Route path="treatments" element={<DentistTreatmentsPage />} />
            <Route path="ratings" element={<PatientRatingsPage />} />
            <Route path="dentist-ratings" element={<DentistRatingsPage />} />
            <Route path="stats" element={<DentistStatsPage />} />

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/stats" element={<AdminStatsPage />} />
              <Route path="admin/ratings" element={<AdminRatingsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
