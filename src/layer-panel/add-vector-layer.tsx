import { Fieldset } from '@headlessui/react';
import React, { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconIdentifier, Input, Modal, FileInput } from '../components';
import { GlobalContext } from '../contexts';
import { DEFAULT_STYLES } from './draw/constants';

type AddLayerModalProps = {
  onClose: VoidFunction;
  show: boolean;
};

type FormData = {
  name: string;
  geojsonData: string;
  file?: FileList;
};

export const AddVectorLayerModal: React.FC<AddLayerModalProps> = ({
  show,
  onClose,
}) => {
  const { layerManager } = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const geojson = JSON.parse(content);

          layerManager?.addGeoJsonLayer({
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            data: geojson,
            styles: DEFAULT_STYLES,
          });

          reset();
          onClose();
        } catch {
          setError('file', {
            type: 'validate',
            message: 'Invalid GeoJSON format',
          });
        }
      };
      reader.readAsText(file);
    },
    [layerManager, onClose, reset, setError],
  );

  const onSubmit = (data: FormData) => {
    try {
      const geojson = JSON.parse(data.geojsonData);
      layerManager?.addGeoJsonLayer({
        name: data.name,
        data: geojson,
        styles: DEFAULT_STYLES,
      });
      reset();
      onClose();
    } catch {
      setError('geojsonData', {
        type: 'validate',
        message: 'Invalid GeoJSON format',
      });
    }
  };

  return (
    <Modal title="Add Vector Layer" show={show} onClose={onClose}>
      <Fieldset as="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <h6 className="text-sm text-gray-500">Basic Info</h6>
        <Input
          label="Layer Name"
          className="mt-2"
          error={errors.name}
          {...register('name', { required: 'Layer name is required' })}
        />

        {/* GeoJSON Data */}
        <h6 className="mt-5 text-sm text-gray-500">GeoJSON Data</h6>

        {/* File Upload */}
        <FileInput
          accept=".geojson,.json"
          onChange={handleFileUpload}
          error={!!errors.file}
          className="mt-2"
        />

        {/* Divider with OR */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="rounded bg-gray-700 px-3 text-sm font-medium text-gray-300">
              OR
            </span>
          </div>
        </div>

        {/* Text Input */}
        <div className="mt-4">
          <label
            htmlFor="geojson-data"
            className="mb-1 block text-sm font-medium text-gray-400"
          >
            Paste GeoJSON Data
          </label>
          <textarea
            id="geojson-data"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={6}
            placeholder='{"type": "FeatureCollection", "features": [...] }'
            {...register('geojsonData', {
              required: 'GeoJSON data is required',
            })}
          />
          {errors.geojsonData && (
            <p className="mt-1 text-sm text-red-400">
              {errors.geojsonData.message}
            </p>
          )}
        </div>

        <div className="mt-2 px-1 text-xs">
          <p className="text-gray-300">
            Enter valid GeoJSON data to create a vector layer. The data should
            be in the GeoJSON format with a FeatureCollection containing one or
            more features.
          </p>
          <a
            className="text-xs text-blue-400 hover:text-blue-300"
            href="https://geojson.org/"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about GeoJSON format →
          </a>
        </div>

        <Button
          type="submit"
          iconIdentifier={IconIdentifier.Plus}
          variant="secondary"
          className="float-end mt-5 border px-5"
          size="sm"
        >
          Add Layer
        </Button>
      </Fieldset>
    </Modal>
  );
};
