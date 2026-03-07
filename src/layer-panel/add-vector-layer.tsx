import { Fieldset } from '@headlessui/react';
import React, { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  BoundsInput,
  IconIdentifier,
  Input,
  Modal,
  FileInput,
  Select,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '../components';
import { GlobalContext } from '../contexts';
import { useAuthStore } from '../core/auth';
import { DEFAULT_STYLES } from './draw/constants';

type AddLayerModalProps = {
  onClose: VoidFunction;
  show: boolean;
};

type FormData = {
  name: string;
  geojsonData: string;
  file?: FileList;
  urlPattern: string;
  sourceLayer: string;
  authRecordId: string;
  northLatitude: number;
  westLongitude: number;
  eastLongitude: number;
  southLatitude: number;
};

export const AddVectorLayerModal: React.FC<AddLayerModalProps> = ({
  show,
  onClose,
}) => {
  const { layerManager } = useContext(GlobalContext);
  const { values: authRecords } = useAuthStore();
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      authRecordId: '',
      northLatitude: 85.0,
      westLongitude: -180.0,
      eastLongitude: 180.0,
      southLatitude: -85.0,
    },
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      setIsFileLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const geojson = JSON.parse(content);

          const layerId = await layerManager?.addGeoJsonLayer({
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            data: geojson,
            styles: DEFAULT_STYLES,
          });

          if (layerId) await layerManager?.zoomToLayer(layerId);
          reset();
          onClose();
        } catch {
          setError('file', {
            type: 'validate',
            message: 'Invalid GeoJSON format',
          });
        } finally {
          setIsFileLoading(false);
        }
      };
      reader.readAsText(file);
    },
    [layerManager, onClose, reset, setError],
  );

  const onSubmit = async (data: FormData) => {
    try {
      if (activeTab === 0) {
        const geojson = JSON.parse(data.geojsonData);
        const layerId = await layerManager?.addGeoJsonLayer({
          name: data.name,
          data: geojson,
          styles: DEFAULT_STYLES,
        });
        if (layerId) await layerManager?.zoomToLayer(layerId);
      } else {
        await layerManager?.addVectorLayer({
          name: data.name,
          tiles: [data.urlPattern],
          sourceLayer: data.sourceLayer,
          authRecordId: data.authRecordId || undefined,
          styles: DEFAULT_STYLES,
          bounds: [
            data.westLongitude,
            data.southLatitude,
            data.eastLongitude,
            data.northLatitude,
          ],
        });
      }
      reset();
      onClose();
    } catch {
      if (activeTab === 0) {
        setError('geojsonData', {
          type: 'validate',
          message: 'Invalid GeoJSON format',
        });
      }
    }
  };

  return (
    <Modal title="Add Vector Layer" show={show} onClose={onClose}>
      <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
        <TabList className="mb-4">
          <Tab>GeoJSON</Tab>
          <Tab>Tile Server (URL)</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Fieldset as="form" onSubmit={handleSubmit(onSubmit)}>
              {/* File Upload Section */}
              <h6 className="text-sm text-gray-500">Upload GeoJSON File</h6>
              <div className="relative">
                <FileInput
                  accept=".geojson,.json"
                  onChange={handleFileUpload}
                  error={!!errors.file}
                  className="mt-2"
                />
                {isFileLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                    <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>

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

              {/* Manual Input Section */}
              <h6 className="text-sm text-gray-500">Enter GeoJSON Manually</h6>
              <Input
                label="Layer Name"
                className="mt-2"
                error={errors.name}
                {...register('name', { required: activeTab === 0 })}
              />

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
                    required:
                      activeTab === 0 ? 'GeoJSON data is required' : false,
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
                  Enter valid GeoJSON data to create a vector layer. The data
                  should be in the GeoJSON format with a FeatureCollection
                  containing one or more features.
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
                disabled={isFileLoading}
              >
                Add Layer
              </Button>
            </Fieldset>
          </TabPanel>

          <TabPanel>
            <Fieldset as="form" onSubmit={handleSubmit(onSubmit)}>
              <h6 className="text-sm text-gray-500">Basic Info</h6>
              <Input
                label="Layer Name"
                className="mt-2"
                error={errors.name}
                {...register('name', { required: activeTab === 1 })}
              />
              <Input
                label="Source Layer (Identifier)"
                className="mt-4"
                error={errors.sourceLayer}
                {...register('sourceLayer', { required: activeTab === 1 })}
              />
              <div className="mt-1 px-1 text-xs text-gray-400">
                The name of the layer within the vector tiles.
              </div>

              {Object.keys(authRecords).length > 0 && (
                <Select
                  label="Auth Method (Optional)"
                  className="mt-5"
                  {...register('authRecordId')}
                >
                  <option value="">None</option>
                  {Object.entries(authRecords).map(([id, record]) => (
                    <option key={id} value={id}>
                      {record.name}
                    </option>
                  ))}
                </Select>
              )}

              <h6 className="mt-5 text-sm text-gray-500">Tile URL</h6>
              <Input
                label="Endpoint URL Pattern"
                className="mt-2"
                error={errors.urlPattern}
                {...register('urlPattern', { required: activeTab === 1 })}
              />
              <div className="mt-2 px-1 text-xs text-gray-300">
                Enter the URL pattern using {'{x}'}, {'{y}'}, and {'{z}'}.
                Example: https://tiles.example.com/data/{'{z}'}/{'{x}'}/{'{y}'}
                .pbf
              </div>

              {/* Tile Coverage */}
              <BoundsInput
                register={register}
                errors={errors}
                required={activeTab === 1}
              />

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
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Modal>
  );
};
