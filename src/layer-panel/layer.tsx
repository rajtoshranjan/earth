import { useToggle } from '@uidotdev/usehooks';
import { useContext } from 'react';
import { GlobalContext } from '../contexts';
import { Icon, IconIdentifier } from '../components';

export const Layer = () => {
  // States.
  const [isVisible, toggleVisibility] = useToggle(true);

  // Context.
  const { map } = useContext(GlobalContext);

  // Handlers
  const onLayerToggle = () => {
    toggleVisibility();
    const layerId = 'satellite';

    if (isVisible) {
      map?.setLayoutProperty(layerId, 'visibility', 'none');
    } else {
      map?.setLayoutProperty(layerId, 'visibility', 'visible');
    }
  };

  return (
    <div className="group inline-flex h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-gray-50 transition-colors hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50">
      <div>
        <Icon identifier={IconIdentifier.Satellite} className="size-4" />
      </div>
      <span className="truncate">Google Satellite</span>

      <div className="ml-auto hidden items-center gap-2 group-hover:flex">
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
