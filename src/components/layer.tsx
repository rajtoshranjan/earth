import React, { useContext } from "react";
import { ReactSVG } from "react-svg";
import { Icon } from "../assets/icons";
import { GlobalContext } from "../contexts";
import { useToggle } from "@uidotdev/usehooks";

export const Layer = () => {
  // States.
  const [isVisible, toggleVisibility] = useToggle(true);

  // Context.
  const { map } = useContext(GlobalContext);

  // Handlers
  const onLayerToggle = () => {
    toggleVisibility();
    const layerId = "satellite";

    if (isVisible) {
      map?.setLayoutProperty(layerId, "visibility", "none");
    } else {
      map?.setLayoutProperty(layerId, "visibility", "visible");
    }
  };

  return (
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
              <ReactSVG
                src={isVisible ? Icon.Eye : Icon.EyeCross}
                className="h-5 w-5"
              />
            </button>

            <button className="text-sm font-medium text-gray-50 hover:text-gray-300">
              <ReactSVG src={Icon.MeatBallMenu} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
