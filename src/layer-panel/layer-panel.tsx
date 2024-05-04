import { useLocalStorage } from '@uidotdev/usehooks';
import classNames from 'classnames';
import { Icon, IconIdentifier } from '../components';
import { Draw } from './draw';
import { Layer } from './layer';
import { AddLayer } from './add-layer';

export const LayerPanel = () => {
  // States.
  const [show, setShow] = useLocalStorage<boolean>(
    'isLayerPanelOpen',
    window.innerWidth >= 1024,
  );

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
      <button
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
      </button>
      {/* Draw tools */}
      <Draw className="absolute -mt-[0.35rem] ml-[15.65rem] " />

      {/* Body */}
      <h2 className="sticky text-sm font-medium text-gray-400">Layers</h2>

      <div className="mt-3 h-[calc(100%-5rem)] w-full space-y-2 overflow-y-auto">
        <Layer />
      </div>

      <AddLayer className="mt-3 w-full" />
    </div>
  );
};
