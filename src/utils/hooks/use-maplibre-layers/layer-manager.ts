import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid4 } from 'uuid';
import { Map } from 'maplibre-gl';
import { AddRasterLayerParams, Layers } from './types';

interface IOptions {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layers>>;
}

export class LayerManager {
  protected readonly map: Map;
  protected setLayers: Dispatch<SetStateAction<Layers>>;

  constructor(options: IOptions) {
    this.map = options.map;
    this.setLayers = options.setLayers;
  }

  addRasterLayer({ name, show = true, ...spec }: AddRasterLayerParams) {
    const sourceId = uuid4();
    this.map.addSource(sourceId, {
      type: 'raster',
      ...spec,
    });

    const layerId = uuid4();
    this.map.addLayer({
      id: layerId,
      source: sourceId,
      type: 'raster',
      layout: {
        visibility: show ? 'visible' : 'none',
      },
    });

    this.setLayers((layers) => {
      return {
        ...layers,
        [layerId]: {
          name,
          show: show,
          sourceId,
          sourceSpec: spec,
        },
      };
    });
  }

  removeLayer(id: string) {
    this.setLayers((layers) => {
      this.map.removeLayer(id);
      this.map.removeSource(layers[id].sourceId);

      delete layers[id];
      return layers;
    });
  }

  toggleLayerVisibility(id: string) {
    this.setLayers((layers) => {
      if (layers[id].show) {
        this.map.setLayoutProperty(id, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(id, 'visibility', 'visible');
      }

      return {
        ...layers,
        [id]: {
          ...layers[id],
          show: !layers[id].show,
        },
      };
    });
  }
}
