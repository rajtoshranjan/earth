import React, { HTMLProps } from "react";
import { Button, Icon, IconIdentifier, Input, Modal } from "../components";
import classNames from "classnames";
import { useToggle } from "@uidotdev/usehooks";

export const AddLayer: React.FC<HTMLProps<HTMLElement>> = ({ className }) => {
  // States.
  const [show, toggle] = useToggle(false);

  // Constants.
  const customClassNames = classNames("border", className);

  return (
    <>
      <Button
        onClick={() => toggle(true)}
        className={customClassNames}
        disabled={show}
        iconIdentifier={IconIdentifier.Plus}
        variant="secondary"
      >
        Add Layer
      </Button>

      <Modal title="Add Raster Layer" show={show} onClose={toggle}>
        <form>
          {/* Tile Overlay */}
          <h6 className="text-sm text-gray-500">Tile Overlay</h6>
          <Input label="Overlay URL Pattern" className="mt-2" />
          <div className="text-xs px-1 mt-2">
            <p className=" text-gray-300">
              Enter the URL of a tile server that hosts a set of images to
              overlay on the map. The URL pattern should specify x, y and zoom
              values in format {"{x}"}/{"{y}"}/{"{x}"}
            </p>
            <a
              className="text-xs text-blue-400 underline"
              href="https://docs.maptiler.com/maplibre-gl-native-ios/tile-url-templates/"
              target="_blank"
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
          <h6 className="text-sm mt-5 text-gray-500">Tile Coverage (bounds)</h6>
          <div className="mt-2 flex flex-col items-center justify-center py-2 gap-5">
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
        </form>
        <div className="flex justify-end mt-6">
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
    </>
  );
};
