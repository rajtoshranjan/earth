import { Button } from '@headlessui/react';
import classNames from 'classnames';
import { useContext } from 'react';
import { useLocalStorage, useToggle } from 'usehooks-ts';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { GlobalContext } from '../contexts';
import { AddLayerModal } from './add-layer';
import { Draw } from './draw';
import { Layer } from './layer';

export const LayerPanel = () => {
  // Context.
  const { layers } = useContext(GlobalContext);

  // States.
  const [show, setShow] = useLocalStorage<boolean>(
    'isLayerPanelOpen',
    window.innerWidth >= 1024,
  );

  const [showAddLayerModal, toggleAddLayerModal, setShowAddLayerModal] =
    useToggle(false);

  // Constants.
  const customClassNames = classNames(
    'absolute z-10 h-screen-container w-64 p-4 bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out',
    {
      '-left-64': !show,
      'left-0': show,
    },
  );

  // Handlers.
  const onClickToggleLayerPanel = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className={customClassNames}>
      {/* Toggle Button */}
      <Button
        className="absolute right-[-1.45rem] top-2/4 flex w-[1.4rem] -translate-y-2/4 rounded-e-lg border-y border-r border-gray-700 bg-gray-900 px-1 py-4 text-gray-50"
        onClick={onClickToggleLayerPanel}
      >
        <Icon
          identifier={IconIdentifier.Down}
          className="size-[0.88rem] -rotate-90 data-[open=true]:rotate-90"
          data-open={show}
        />
      </Button>

      {/* Draw tools */}
      <Draw className="absolute right-[-2.85rem] mt-[-0.35rem]" />

      {/* Body */}
      <div className="flex items-center justify-between">
        <h2 className="sticky text-sm font-medium text-gray-400">Layers</h2>
        <DropdownMenu
          iconIdentifier={IconIdentifier.MeatBallMenu}
          className="bg-transparent"
          anchor="bottom start"
        >
          <DropdownMenu.Item onClick={() => setShowAddLayerModal(true)}>
            <Icon identifier={IconIdentifier.Layer} />
            Add Raster Layer
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>

      <div className="mt-3 h-[calc(100%-2.5rem)] w-full space-y-2 overflow-y-auto">
        {layers &&
          Object.entries(layers).map(([layerId, layerInfo]) => (
            <Layer key={layerId} layerId={layerId} layerInfo={layerInfo} />
          ))}

        {layers && Object.keys(layers).length === 0 && (
          <div>
            <p className="mt-4 text-center text-sm text-gray-600">
              No layers available
            </p>
          </div>
        )}
      </div>

      {/* Add layer modal */}
      <AddLayerModal show={showAddLayerModal} onClose={toggleAddLayerModal} />
    </div>
  );
};
