import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Fieldset } from '@headlessui/react';
import {
  Button,
  BoundsInput,
  IconIdentifier,
  Input,
  Modal,
  Select,
} from '../components';
import { GlobalContext } from '../contexts';
import { useAuthStore } from '../core/auth';

type AddLayerModalProps = {
  onClose: VoidFunction;
  show: boolean;
};

type FormData = {
  name: string;
  urlPattern: string;
  tileSize: number;
  northLatitude: number;
  westLongitude: number;
  eastLongitude: number;
  southLatitude: number;
  authRecordId: string;
};

export const AddRasterLayerModal: React.FC<AddLayerModalProps> = ({
  show,
  onClose,
}) => {
  // Context.
  const { layerManager } = useContext(GlobalContext);
  const { values: authRecords } = useAuthStore();

  // Hooks.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tileSize: 256,
      northLatitude: 85.0,
      westLongitude: -180.0,
      eastLongitude: 180.0,
      southLatitude: -85.0,
      authRecordId: '',
    },
  });

  // Handlers.
  const onSubmit = async (data: FormData) => {
    await layerManager?.addRasterLayer({
      name: data.name,
      tiles: [data.urlPattern],
      bounds: [
        data.westLongitude,
        data.southLatitude,
        data.eastLongitude,
        data.northLatitude,
      ],
      tileSize: data.tileSize,
      authRecordId: data.authRecordId || undefined,
    });

    reset();
    onClose();
  };

  return (
    <Modal title="Add Raster Layer" show={show} onClose={onClose}>
      <Fieldset as="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <h6 className="text-sm text-gray-500">Basic Info</h6>
        <Input
          label="Layer Name"
          className="mt-2"
          error={errors.name}
          {...register('name', { required: true })}
        />

        {/* Authentication */}
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

        {/* Tile Overlay */}
        <h6 className="mt-5 text-sm text-gray-500">Tile Overlay</h6>

        <Input
          label="Overlay URL Pattern"
          className="mt-2"
          {...register('urlPattern', {
            required: true,
          })}
          error={errors.urlPattern}
        />
        <div className="mt-2 px-1 text-xs">
          <p className="text-gray-300">
            Enter the URL of a tile server that hosts a set of images to overlay
            on the map. The URL pattern should specify x, y and zoom values in
            format {'{z}'}/{'{x}'}/{'{y}'}
          </p>
          <a
            className="text-xs text-blue-400 underline"
            href="https://docs.maptiler.com/maplibre-gl-native-ios/tile-url-templates/"
            target="_blank"
            rel="noreferrer"
          >
            Learn More
          </a>
        </div>

        <Input
          label="Tile Size (px)"
          className="mt-6"
          type="number"
          {...register('tileSize', {
            required: true,
          })}
          error={errors.tileSize}
        />

        {/* Tile Coverage */}
        <BoundsInput register={register} errors={errors} required={true} />

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
