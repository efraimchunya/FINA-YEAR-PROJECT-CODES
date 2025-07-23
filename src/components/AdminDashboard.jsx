import React, { useEffect, useState } from 'react';
import { fetchSites, addSite, updateSite, deleteSite } from '../utils/api';

export default function AdminDashboard() {
  const [sites, setSites] = useState([]);
  const [editingSite, setEditingSite] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', latitude: '', longitude: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      const res = await fetchSites();
      setSites(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { name, description, category, latitude, longitude } = form;
    if (!name || !category || !latitude || !longitude) {
      setError('Please fill all required fields');
      return;
    }
    const payload = {
      name,
      description,
      category,
      location: { lat: parseFloat(latitude), lng: parseFloat(longitude) }
    };

    try {
      if (editingSite) {
        await updateSite(editingSite.id, payload);
      } else {
        await addSite(payload);
      }
      setForm({ name: '', description: '', category: '', latitude: '', longitude: '' });
      setEditingSite(null);
      loadSites();
    } catch (err) {
      setError('Failed to save site');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this site?")) return;
    try {
      await deleteSite(id);
      loadSites();
    } catch (err) {
      alert("Failed to delete");
    }
  }

  function startEdit(site) {
    setEditingSite(site);
    setForm({
      name: site.name,
      description: site.description,
      category: site.category,
      latitude: site.location.lat,
      longitude: site.location.lng,
    });
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Admin Dashboard - Manage Tourist Sites</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} required />
        <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} required />
        <button type="submit">{editingSite ? 'Update' : 'Add'}</button>
        {editingSite && <button type="button" onClick={() => { setEditingSite(null); setForm({ name: '', description: '', category: '', latitude: '', longitude: '' }); }}>Cancel</button>}
      </form>

      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <strong>{site.name}</strong> ({site.category}) - {site.description}
            <button onClick={() => startEdit(site)} style={{ marginLeft: 10 }}>Edit</button>
            <button onClick={() => handleDelete(site.id)} style={{ marginLeft: 10, color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
