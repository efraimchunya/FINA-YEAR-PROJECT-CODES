import React, { useState } from 'react';

const SitesTable = ({ sites, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search sites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-sm dark:bg-gray-800 dark:border-gray-600"
      />
      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Description</th>
            <th className="border border-gray-300 p-2 text-left">Coordinates</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSites.map((site) => (
            <tr
              key={site.id}
              className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <td className="border border-gray-300 p-2">{site.name}</td>
              <td className="border border-gray-300 p-2">{site.description}</td>
              <td className="border border-gray-300 p-2">
                {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                <button
                  onClick={() => onEdit(site)}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(site)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredSites.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No sites found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SitesTable;
