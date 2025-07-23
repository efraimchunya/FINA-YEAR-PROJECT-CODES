import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function CategoryFilter({ selectedCategories, onCategoryChange }) {
  const categories = [
    { id: 'beach', label: 'Beaches', icon: '🏖️' },
    { id: 'cultural', label: 'Cultural Sites', icon: '🕌' },
    { id: 'historical', label: 'Historical Sites', icon: '🏛️' },
  ];

  const handleCategoryToggle = (categoryId, checked) => {
    if (checked) {
      onCategoryChange([...selectedCategories, categoryId]);
    } else {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 mb-3">Filter by Category</h3>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-3">
          <Checkbox
            id={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) => handleCategoryToggle(category.id, checked)}
          />
          <Label
            htmlFor={category.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-sm font-medium">{category.label}</span>
          </Label>
        </div>
      ))}
    </div>
  );
}
