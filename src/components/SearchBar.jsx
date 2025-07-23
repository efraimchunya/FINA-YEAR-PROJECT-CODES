import React from 'react';

export default function SearchBar({ searchText, onSearchChange }) {
  return (
    <input
      type="search"
      placeholder="Search tourist sites or activities..."
      value={searchText}
      onChange={e => onSearchChange(e.target.value)}
      style={{ width: '100%', padding: '8px', marginBottom: 10 }}
    />
  );
}
