import { useState } from "react";

export function EditProfileDialog({ open, onOpenChange, currentData, onSave }) {
  const [formData, setFormData] = useState(currentData);

  if (!open) return null;
  
  const closeDialog = () => onOpenChange(false);

  const handleSave = () => {
    onSave(formData);
    closeDialog();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/75">
      <div className="bg-gray-400 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg text-blue-600 font-semibold mb-2">Editar Perfil</h2>
        <div className="space-y-3">
          {["username", "handle", "description", "avatarUrl", "bannerUrl"].map((field) => (
            <div key={field} className="flex flex-col bg-gray-400 rounded-lg">
              <label className="text-sm capitalize mb-1 text-white font-semibold">{field}</label>
              {field === "description" ? (
                <textarea
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  rows="3"
                  className="border rounded px-2 py-1 text-black bg-gray-100"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="border rounded px-2 py-1 bg-gray-300"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeDialog} className="bg-white border border-black px-3 py-1 rounded">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-blue-600 border border-black text-white px-3 py-1 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
