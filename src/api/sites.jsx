// api/sites.js
export const fetchSites = async (page = 1, search = '') => {
  const res = await fetch(`/api/sites?page=${page}&search=${search}`);
  if (!res.ok) throw new Error('Failed to fetch sites');
  return res.json();
};

export const createSite = async (siteData) => {
  const res = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(siteData),
  });
  if (!res.ok) throw new Error('Failed to create site');
  return res.json();
};

export const updateSite = async (id, siteData) => {
  const res = await fetch(`/api/sites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(siteData),
  });
  if (!res.ok) throw new Error('Failed to update site');
  return res.json();
};

export const deleteSite = async (id) => {
  const res = await fetch(`/api/sites/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete site');
  return res.json();
};
