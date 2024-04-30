import { useToggle } from "@uidotdev/usehooks";
import { useContext } from "react";
import { GlobalContext } from "../contexts";
import { Icon, IconIdentifier } from "../components";

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
          <Icon identifier={IconIdentifier.Satellite} className="size-4 mr-2" />
          Google Satellite
          <div className="flex items-center gap-2 ">
            <button
              className="flex text-sm font-medium text-gray-50 hover:text-gray-300"
              onClick={onLayerToggle}
            >
              <Icon
                identifier={
                  isVisible ? IconIdentifier.Eye : IconIdentifier.EyeCross
                }
                className="size-5"
              />
            </button>

            <button className="flex text-sm font-medium text-gray-50 hover:text-gray-300">
              <Icon
                identifier={IconIdentifier.MeatBallMenu}
                className="size-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
