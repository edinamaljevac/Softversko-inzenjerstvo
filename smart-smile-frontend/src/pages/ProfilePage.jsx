import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPatientProfile } from "../api/profileService";
import PatientProfileForm from "../components/PatientProfileForm";
import { Phone, MapPin, Calendar, User, FileText } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || !hasProfile) return;

    async function fetchProfile() {
      try {
        const data = await getMyPatientProfile();
        setProfile(data);
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, hasProfile]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Učitavanje profila...
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Kreiranje profila
          </h2>
          <p className="text-slate-600 mb-6">
            Nemate još kreiran profil. Molimo Vas da unesete osnovne podatke.
          </p>

          <PatientProfileForm
            mode="create"
            onSuccess={(createdProfile) => {
              setProfile(createdProfile);
              setHasProfile(true);
            }}
          />
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <PatientProfileForm
            mode="edit"
            initialData={profile}
            onSuccess={(updatedProfile) => {
              setProfile(updatedProfile);
              setIsEditing(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-6 py-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white mb-3">
            <User size={36} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            {user.username || "Pacijent"}
          </h2>
          <p className="text-slate-600 text-sm">{user.email}</p>
        </div>

        <div className="p-6 space-y-8">
          <Section title="Lični podaci">
            <InfoItem icon={<Calendar size={18} />} label="Datum rođenja">
              {profile?.date_of_birth || "Nije uneto"}
            </InfoItem>

            <InfoItem icon={<User size={18} />} label="Pol">
              {profile?.gender === "M"
                ? "Muški"
                : profile?.gender === "F"
                  ? "Ženski"
                  : "Nije uneto"}
            </InfoItem>

            <InfoItem icon={<MapPin size={18} />} label="Adresa">
              {profile?.address || "Nije uneto"}
            </InfoItem>
          </Section>

          <Section title="Medicinski podaci">
            <InfoItem icon={<Phone size={18} />} label="Hitni kontakt">
              {profile?.emergency_contact_name || "Nije uneto"}
            </InfoItem>

            <InfoItem icon={<Phone size={18} />} label="Telefon (hitni)">
              {profile?.emergency_contact_phone || "Nije uneto"}
            </InfoItem>

            <InfoItem icon={<FileText size={18} />} label="Medicinske napomene">
              {profile?.medical_notes ? (
                <p className="text-slate-600 whitespace-pre-line">
                  {profile.medical_notes}
                </p>
              ) : (
                "Nije uneto"
              )}
            </InfoItem>
          </Section>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-xl font-medium"
          >
            Izmeni profil
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function InfoItem({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 text-slate-700">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
