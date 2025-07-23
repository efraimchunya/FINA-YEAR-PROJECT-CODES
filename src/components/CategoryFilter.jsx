import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <select value={selectedCategory} onChange={(e) => onChange(e.target.value)} style={{ marginBottom: 10 }}>
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
