import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import classNames from 'classnames';
import { Button } from '@headlessui/react';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { Draw } from './draw';
import { Layer } from './layer';
import { AddLayer } from './add-layer';

export const LayerPanel = () => {
  // States.
  const [show, setShow] = useLocalStorage<boolean>(
    'isLayerPanelOpen',
    window.innerWidth >= 1024,
  );

  const [showAddLayerModal, toggleAddLayerModal] = useToggle(false);

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
        className="absolute top-2/4 ml-60 flex w-[1.4rem] -translate-y-2/4 rounded-e-lg border-y border-r border-gray-700 bg-gray-900 px-1 py-4 text-gray-50"
        onClick={onClickToggleLayerPanel}
      >
        <Icon
          identifier={
            show
              ? IconIdentifier.ChevronSmallLeft
              : IconIdentifier.ChevronSmallRight
          }
          className="size-[14px]"
        />
      </Button>

      {/* Draw tools */}
      <Draw className="absolute ml-[15.65rem] mt-[-0.35rem] " />

      {/* Body */}
      <div className="flex items-center justify-between">
        <h2 className="sticky text-sm font-medium text-gray-400">Layers</h2>
        <DropdownMenu
          iconIdentifier={IconIdentifier.MeatBallMenu}
          className=" bg-transparent"
          anchor="bottom start"
        >
          <DropdownMenu.Item onClick={() => toggleAddLayerModal(true)}>
            <Icon identifier={IconIdentifier.Layer} />
            Add Raster Layer
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>

      <div className="mt-3 h-[calc(100%-2.5rem)] w-full space-y-2 overflow-y-auto">
        <Layer />
      </div>

      {/* Add layer modal */}
      <AddLayer show={showAddLayerModal} onClose={toggleAddLayerModal} />
    </div>
  );
};
