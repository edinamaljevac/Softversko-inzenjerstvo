import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPatientProfileById } from "../api/profileService";
import { getPatientToothRecords } from "../api/toothRecordService";

import DentalChart from "../components/DentalChart";
import ToothRecordModal from "../components/ToothRecordModal";

export default function PatientDetailsPage() {
  const { id, appointmentId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [toothRecords, setToothRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTooth, setSelectedTooth] = useState(null);
  const [showToothModal, setShowToothModal] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getPatientProfileById(id);
        setProfile(data);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  useEffect(() => {
    async function fetchToothRecords() {
      const data = await getPatientToothRecords(id);
      setToothRecords(data);
    }
    fetchToothRecords();
  }, [id]);

  function getRecordsForTooth(toothNumber) {
    return toothRecords.filter((record) => record.tooth_number === toothNumber);
  }

  function handleToothClick(toothNumber) {
    setSelectedTooth(toothNumber);
    setShowToothModal(true);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Učitavanje profila...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Nazad
      </button>

      <h2 className="text-2xl font-semibold">Profil pacijenta</h2>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-500">Korisničko ime</p>
            <p className="font-medium">{profile.user.username}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">{profile.user.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Telefon</p>
            <p className="font-medium">{profile.user.phone || "Nije uneto"}</p>
          </div>
        </div>

        <hr />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Hitni kontakt (ime)</p>
            <p className="font-medium">
              {profile.emergency_contact_name || "Nije uneto"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Hitni kontakt (telefon)</p>
            <p className="font-medium">
              {profile.emergency_contact_phone || "Nije uneto"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 mb-1">Medicinske napomene</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 whitespace-pre-line">
            {profile.medical_notes || "Nema unetih medicinskih napomena."}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Stomatološki karton</h3>
        <p className="text-slate-500 mb-4">
          Pregled prethodnih i unos novih usluga
        </p>

        <div className="overflow-x-auto">
          <DentalChart onToothClick={handleToothClick} />
        </div>
      </div>

      {showToothModal && selectedTooth && (
        <ToothRecordModal
          toothNumber={selectedTooth}
          appointmentId={appointmentId}
          patientId={id}
          records={getRecordsForTooth(selectedTooth)}
          onClose={() => {
            setShowToothModal(false);
            setSelectedTooth(null);
          }}
          onSuccess={async () => {
            const updated = await getPatientToothRecords(id);
            setToothRecords(updated);
            setShowToothModal(false);
            setSelectedTooth(null);
          }}
        />
      )}
    </div>
  );
}
