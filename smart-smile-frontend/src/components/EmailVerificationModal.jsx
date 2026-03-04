export default function EmailVerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center relative shadow-lg">
        <h2 className="text-xl md:text-2xl font-semibold mb-3 text-slate-900">
          Proverite vaš email 📧
        </h2>

        <p className="text-slate-600 text-sm md:text-base mb-6">
          Poslali smo vam link za potvrdu naloga. Molimo proverite vaš inbox (i
          spam folder).
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700
                     text-white rounded-xl py-3 transition font-medium"
        >
          Zatvori modal
        </button>
      </div>
    </div>
  );
}
