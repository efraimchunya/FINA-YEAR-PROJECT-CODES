import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  name: yup.string().required('Site name is required'),
  description: yup.string().required('Description is required'),
  latitude: yup
    .number()
    .required('Latitude is required')
    .min(-90)
    .max(90),
  longitude: yup
    .number()
    .required('Longitude is required')
    .min(-180)
    .max(180),
  imageUrl: yup.string().url('Must be a valid URL').nullable(),
});

const SiteFormModal = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {defaultValues?.id ? 'Edit Site' : 'Add New Site'}
        </h2>

        <label className="block mb-2">
          Site Name
          <input
            {...register('name')}
            className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-red-600 text-sm">{errors.name?.message}</p>
        </label>

        <label className="block mb-2">
          Description
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-red-600 text-sm">{errors.description?.message}</p>
        </label>

        <label className="block mb-2">
          Latitude
          <input
            type="number"
            step="any"
            {...register('latitude')}
            className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-red-600 text-sm">{errors.latitude?.message}</p>
        </label>

        <label className="block mb-2">
          Longitude
          <input
            type="number"
            step="any"
            {...register('longitude')}
            className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-red-600 text-sm">{errors.longitude?.message}</p>
        </label>

        <label className="block mb-4">
          Image URL
          <input
            {...register('imageUrl')}
            className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-600"
          />
          <p className="text-red-600 text-sm">{errors.imageUrl?.message}</p>
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
          >
            {defaultValues?.id ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteFormModal;
