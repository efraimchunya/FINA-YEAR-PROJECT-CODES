// src/components/Favorites.jsx
const Favorites = ({ favorites, removeFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((site) => (
        <div
          key={site.id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow"
        >
          <img
            src={site.imageUrl}
            alt={site.name}
            className="w-full h-32 object-cover rounded"
          />
          <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {site.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{site.description}</p>
          <button
            onClick={() => removeFavorite(site.id)}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
