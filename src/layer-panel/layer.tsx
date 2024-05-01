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
    <div className="group w-full inline-flex gap-2 items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-10 px-3 text-gray-50 hover:bg-gray-800">
      <div>
        <Icon identifier={IconIdentifier.Satellite} className="size-4" />
      </div>
      <span className="truncate">Google Satellite</span>

      <div className="group-hover:flex items-center gap-2 hidden ml-auto">
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
          <Icon identifier={IconIdentifier.MeatBallMenu} className="size-4" />
        </button>
      </div>
    </div>
  );
};
