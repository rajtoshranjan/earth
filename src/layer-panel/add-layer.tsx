import React from 'react';
import { Fieldset } from '@headlessui/react';
import { Button, IconIdentifier, Input, Modal } from '../components';

type AddLayerProps = {
  onClose: VoidFunction;
  show: boolean;
};

export const AddLayer: React.FC<AddLayerProps> = ({ ...rest }) => {
  return (
    <Modal title="Add Raster Layer" {...rest}>
      <Fieldset as="form">
        {/* Tile Overlay */}
        <h6 className="text-sm text-gray-500">Tile Overlay</h6>
        <Input label="Overlay URL Pattern" className="mt-2" />
        <div className="mt-2 px-1 text-xs">
          <p className=" text-gray-300">
            Enter the URL of a tile server that hosts a set of images to overlay
            on the map. The URL pattern should specify x, y and zoom values in
            format {'{x}'}/{'{y}'}/{'{x}'}
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
          defaultValue={256}
        />

        {/* Tile Coverage */}
        <h6 className="mt-5 text-sm text-gray-500">Tile Coverage (bounds)</h6>
        <div className="mt-2 flex flex-col items-center justify-center gap-5 py-2">
          <Input
            className="w-6/12"
            label="North Latitude"
            defaultValue={85.0}
            type="number"
          />
          <div className="flex items-center justify-center gap-2">
            <Input
              className="w-6/12"
              label="West Longitude"
              defaultValue={-180.0}
              type="number"
            />
            <Input
              className="w-6/12"
              label="East Longitude"
              defaultValue={180.0}
              type="number"
            />
          </div>
          <Input
            className="w-6/12"
            label="South Latitude"
            defaultValue={-85.0}
            type="number"
          />
        </div>
      </Fieldset>
      <div className="mt-6 flex justify-end">
        <Button
          iconIdentifier={IconIdentifier.Plus}
          variant="secondary"
          className="border px-5"
          size="md"
        >
          Add Layer
        </Button>
      </div>
    </Modal>
  );
};
