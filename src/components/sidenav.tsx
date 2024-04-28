import React, { useContext, useState } from "react";
import { GlobalContext } from "../contexts";
import classNames from "classnames";
import { ReactSVG } from "react-svg";
import { Icon } from "../assets/icons";

export const SideNav = () => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [show, setShow] = useState<boolean>(false);

  // Constants.
  const customClassNames = classNames(
    "absolute z-10 h-screen-container w-64 p-4 space-y-4 flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out",
    {
      "-left-64": !show,
      "left-0": show,
    }
  );

  // Handlers.
  const onLayerToggle = () => {
    const layerId = "satellite";

    const visibility = map?.getLayoutProperty(layerId, "visibility");

    if (visibility === "visible") {
      map?.setLayoutProperty(layerId, "visibility", "none");
    } else {
      map?.setLayoutProperty(layerId, "visibility", "visible");
    }
  };

  return (
    <div className={customClassNames}>
      <button
        className="absolute ml-60 px-1 py-4 w-5 top-2/4 -translate-y-2/4 bg-gray-900 text-gray-50 rounded-e-lg border-r border-t border-b border-gray-700"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <ReactSVG src={Icon.ChevronSmallLeft} />
        ) : (
          <ReactSVG src={Icon.ChevronSmallRight} />
        )}
      </button>

      <div className="flex flex-col space-y-2">
        <div className="inline-flex justify-between">
          <h2 className="text-sm font-medium text-gray-400">Layers</h2>

          <button className="inline-flex items-center whitespace-nowrap text-sm font-sm h-5 p-2 justify-start text-gray-400 hover:text-gray-300">
            <ReactSVG src={Icon.Plus} className="h-4 w-4 mr-2" />
            Add Layer
          </button>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex space-between space-x-7  items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 justify-start text-gray-50 hover:bg-gray-800">
              <ReactSVG src={Icon.Satellite} className="h-4 w-4 mr-2" />
              Google Satellite
              <div className="flex items-center gap-2 ">
                <button
                  className="text-sm font-medium text-gray-50 hover:text-gray-300"
                  onClick={onLayerToggle}
                >
                  <ReactSVG src={Icon.Eye} className="h-5 w-5" />
                </button>

                <button className="text-sm font-medium text-gray-50 hover:text-gray-300">
                  <ReactSVG src={Icon.MeatBallMenu} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
