import React, { useState, useEffect } from "react";

export default function EditSiteModal({ isOpen, onClose, onSave, site }) {
  const [name, setName] = useState("");
  const [island, setIsland] = useState("");

  useEffect(() => {
    if (site) {
      setName(site.properties.name || "");
      setIsland(site.properties.island || "");
    }
  }, [site]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...site, properties: { ...site.properties, name, island } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Site Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Site Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Island</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={island}
              onChange={(e) => setIsland(e.target.value)}
              required
            >
              <option value="">Select Island</option>
              <option value="Unguja">Unguja</option>
              <option value="Pemba">Pemba</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
