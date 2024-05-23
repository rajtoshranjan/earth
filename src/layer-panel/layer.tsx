import React, { useContext } from 'react';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { LayerInfo } from '../utils/hooks';
import { GlobalContext } from '../contexts';

type LayerProps = {
  layerId: string;
  layerInfo: LayerInfo;
};

export const Layer: React.FC<LayerProps> = ({
  layerInfo,

  layerId,
}) => {
  // Context.
  const { layerManager } = useContext(GlobalContext);

  return (
    <div
      className="group inline-flex h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-gray-50 transition-colors hover:bg-gray-800 data-[visible=false]:text-gray-500"
      data-visible={layerInfo.show}
      draggable
    >
      <div>
        <Icon identifier={IconIdentifier.Layer} className="size-4" />
      </div>
      <span className="truncate">{layerInfo.name}</span>

      <div className="ml-auto flex items-center gap-2 *:hidden group-hover:*:block">
        <DropdownMenu
          iconIdentifier={IconIdentifier.MeatBallMenu}
          className="bg-transparent px-[0.15rem] py-[0.1rem] data-[open]:block"
          anchor="bottom end"
        >
          <DropdownMenu.Item
            onClick={() => {
              layerManager?.removeLayer(layerId);
            }}
          >
            <Icon identifier={IconIdentifier.Bin} className="size-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu>
        <button
          className="flex text-sm font-medium hover:text-gray-300 group-data-[visible=false]:block"
          onClick={() => layerManager?.toggleLayerVisibility(layerId)}
        >
          <Icon
            identifier={
              layerInfo.show ? IconIdentifier.Eye : IconIdentifier.EyeCross
            }
            className="size-5"
          />
        </button>
      </div>
    </div>
  );
};
