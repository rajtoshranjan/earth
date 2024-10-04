import FileSaver from 'file-saver';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { GlobalContext } from '../contexts';
import { LayerInfo } from '../core/hooks';

type LayerProps = {
  layerId: string;
  layerInfo: LayerInfo;
};

export const Layer: React.FC<LayerProps> = ({ layerInfo, layerId }) => {
  // Context.
  const { layerManager, editingLayerId, setEditingLayerId } =
    useContext(GlobalContext);

  // Constants.
  const isEditing = layerId === editingLayerId;

  // Handlers.
  const downloadDrawnLayer = () => {
    if (layerInfo.type !== 'geojson') return;

    const blob = new Blob([JSON.stringify(layerInfo.sourceSpec.data)], {
      type: 'application/geojson',
    });
    FileSaver.saveAs(blob, layerInfo.name + '.geojson');
  };

  const onEditBtnClick = () => {
    if (!editingLayerId) {
      setEditingLayerId?.(layerId);
    } else {
      toast.error('Close the drawing tool before editing another layer');
    }
  };

  return (
    <div
      className="group inline-flex h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-gray-50 transition-colors hover:bg-gray-800 data-[active=true]:bg-gray-700 data-[visible=false]:text-gray-500"
      data-visible={layerInfo.show}
      data-active={isEditing}
      draggable
    >
      <div>
        <Icon
          identifier={
            layerInfo.type == 'raster'
              ? IconIdentifier.TileLayer
              : IconIdentifier.VectorLayer
          }
          className="p-[0.5px]"
        />
      </div>
      <span className="truncate">{layerInfo.name}</span>

      <div className="ml-auto flex items-center gap-2 md:*:hidden md:group-hover:*:block">
        <button
          className="flex text-sm font-medium hover:text-gray-300 disabled:text-gray-500 group-data-[visible=false]:block"
          onClick={() => layerManager?.toggleLayerVisibility(layerId)}
          disabled={isEditing}
        >
          <Icon
            identifier={
              layerInfo.show ? IconIdentifier.Eye : IconIdentifier.EyeCross
            }
            className="size-5"
          />
        </button>

        <DropdownMenu
          iconIdentifier={IconIdentifier.MeatBallMenu}
          className="bg-transparent px-[0.15rem] py-[0.1rem] data-[open]:block"
          anchor="bottom end"
          disabled={!layerInfo.show}
        >
          <DropdownMenu.Item
            onClick={() => {
              layerManager?.zoomToLayer(layerId);
            }}
          >
            <Icon identifier={IconIdentifier.Plane} className="size-4" />
            Fly to
          </DropdownMenu.Item>

          {layerInfo.type === 'geojson' && (
            <>
              <DropdownMenu.Item onClick={onEditBtnClick} disabled={isEditing}>
                <Icon identifier={IconIdentifier.Edit} className="size-4" />
                Edit
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={downloadDrawnLayer}
                disabled={isEditing}
              >
                <Icon identifier={IconIdentifier.Download} className="size-4" />
                Download
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Item
            onClick={() => {
              layerManager?.removeLayer(layerId);
            }}
            disabled={isEditing}
          >
            <Icon identifier={IconIdentifier.Bin} className="size-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>
    </div>
  );
};
