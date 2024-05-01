import { useLocalStorage } from "@uidotdev/usehooks";
import classNames from "classnames";
import { Draw } from "./draw";
import { Layer } from "./layer";
import { Icon, IconIdentifier } from "../components";
import { AddLayer } from "./add-layer";

export const LayerPanel = () => {
  // States.
  const [show, setShow] = useLocalStorage<boolean>(
    "isLayerPanelOpen",
    window.innerWidth >= 1024
  );

  // Constants.
  const customClassNames = classNames(
    "absolute z-10 h-screen-container w-64 p-4 bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out",
    {
      "-left-64": !show,
      "left-0": show,
    }
  );

  // Handlers.
  const onClickToggleLayerPanel = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className={customClassNames}>
      {/* Toggle Button */}
      <button
        className="absolute flex ml-60 px-1 py-4 w-[1.4rem] top-2/4 -translate-y-2/4 bg-gray-900 text-gray-50 rounded-e-lg border-r border-t border-b border-gray-700"
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
      <Draw className="absolute ml-[15.65rem] -mt-[0.35rem]" />

      {/* Body */}
      <h2 className="sticky text-sm font-medium text-gray-400">Layers</h2>

      <div className="space-y-2 w-full h-[calc(100%-5rem)] mt-3 overflow-y-scroll">
        <Layer />
      </div>

      <AddLayer className="w-full mt-3" />
    </div>
  );
};
