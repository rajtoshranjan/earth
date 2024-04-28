import classNames from "classnames";
import { ReactSVG } from "react-svg";
import { Icon } from "../assets/icons";
import { Draw } from "./draw";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Layer } from "./layer";

export const SideNav = () => {
  // States.
  const [show, setShow] = useLocalStorage<boolean>(
    "isSideNavOpen",
    window.innerWidth >= 1024
  );

  // Constants.
  const customClassNames = classNames(
    "absolute z-10 h-screen-container w-64 p-4 flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out",
    {
      "-left-64": !show,
      "left-0": show,
    }
  );

  // Handlers.
  const onClickToggleSideNav = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className={customClassNames}>
      {/* Toggle Button */}
      <button
        className="absolute ml-60 px-1 py-4 w-5 top-2/4 -translate-y-2/4 bg-gray-900 text-gray-50 rounded-e-lg border-r border-t border-b border-gray-700"
        onClick={onClickToggleSideNav}
      >
        {show ? (
          <ReactSVG src={Icon.ChevronSmallLeft} />
        ) : (
          <ReactSVG src={Icon.ChevronSmallRight} />
        )}
      </button>

      {/* Body */}
      <div className="flex flex-col space-y-2">
        <div className="inline-flex justify-between">
          <h2 className="text-sm font-medium text-gray-400">Layers</h2>

          <button className="inline-flex items-center whitespace-nowrap text-sm font-sm h-5 p-2 justify-start text-gray-400 hover:text-gray-300">
            <ReactSVG src={Icon.Plus} className="h-4 w-4 mr-2" />
            Add Layer
          </button>
        </div>

        <Layer />
      </div>

      {/* Draw tools */}
      <Draw className="absolute ml-60 -mt-1 pl-3" />
    </div>
  );
};
