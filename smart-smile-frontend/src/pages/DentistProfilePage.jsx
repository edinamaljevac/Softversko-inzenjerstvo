import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyDentistProfile } from "../api/profileService";
import DentistProfileForm from "../components/DentistProfileForm";

export default function DentistProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || !hasProfile) return;

    async function fetchProfile() {
      try {
        const data = await getMyDentistProfile();
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
            Nemate još kreiran stomatološki profil. Molimo Vas da unesete
            osnovne podatke kako bi pacijenti mogli da Vas pronađu.
          </p>

          <DentistProfileForm
            mode="create"
            onSuccess={(created) => {
              setProfile(created);
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
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Izmena profila
          </h2>

          <DentistProfileForm
            mode="edit"
            initialData={profile}
            onSuccess={(updated) => {
              setProfile(updated);
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
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mb-3">
            {user.email?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            {profile.full_name || "Stomatolog"}
          </h2>
          <p className="text-slate-600">
            {profile.specialization || "Bez specijalizacije"}
          </p>

          {profile.experience_years && (
            <span className="inline-block mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {profile.experience_years} godina iskustva
            </span>
          )}
        </div>

        <div className="p-6 space-y-5 text-slate-700">
          <ProfileItem label="Biografija">
            {profile.biography || "—"}
          </ProfileItem>

          <ProfileItem label="Adresa ordinacije">
            {profile.clinic_address || "—"}
          </ProfileItem>

          <ProfileItem label="Telefon ordinacije">
            {profile.phone_clinic || "—"}
          </ProfileItem>

          <ProfileItem label="Email">{user.email}</ProfileItem>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-xl font-medium"
          >
            Izmeni profil
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, children }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{children}</p>
    </div>
  );
}
