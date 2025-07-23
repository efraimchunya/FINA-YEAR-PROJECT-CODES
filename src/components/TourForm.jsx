import React, { useState, useEffect } from "react";

export default function TourForm({ currentTour, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (currentTour) {
      setName(currentTour.name || "");
      setDescription(currentTour.description || "");
      setPrice(currentTour.price !== undefined ? currentTour.price.toString() : "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [currentTour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a tour name.");
      return;
    }
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      alert("Please enter a valid non-negative price.");
      return;
    }
    onSave({
      id: currentTour?.id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 max-w-md">
      <h3 className="text-xl font-semibold">{currentTour ? "Edit Tour" : "Add New Tour"}</h3>
      <div>
        <label htmlFor="name" className="block font-medium mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label htmlFor="price" className="block font-medium mb-1">Price ($)</label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          {currentTour ? "Update" : "Add"}
        </button>
        {currentTour && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
