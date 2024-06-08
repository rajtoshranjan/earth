import { Dispatch, SetStateAction } from 'react';
import { Map } from '../../maplibre';
import { AddRasterLayerParams, AddGeoJsonLayerParams, Layers } from './types';

interface IOptions {
  map: Map;
  initialLayers: Layers;
  setLayers: Dispatch<SetStateAction<Layers>>;
}

export class LayerManager {
  protected readonly map: Map;
  protected setLayers: Dispatch<SetStateAction<Layers>>;

  constructor(options: IOptions) {
    this.map = options.map;
    this.setLayers = options.setLayers;

    if (this.map) {
      this._loadInitialLayers(options.initialLayers);
    }
  }

  private _loadInitialLayers(initialLayers: Layers) {
    Object.entries(initialLayers).forEach(([id, layerInfo]) => {
      switch (layerInfo.type) {
        case 'raster':
          this.map.createRasterLayer(
            { id, ...layerInfo.sourceSpec },
            layerInfo.show,
          );
          break;
        case 'geojson':
          this.map.createGeoJSONLayer(
            { id, ...layerInfo.sourceSpec },
            layerInfo.show,
          );
          break;
      }
    });
  }

  addRasterLayer(params: AddRasterLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createRasterLayer(sourceSpec, show);

    this.setLayers((layers) => {
      return {
        ...layers,
        [id]: {
          name,
          show,
          type: 'raster',
          sourceSpec,
        },
      };
    });
  }

  addGeoJsonLayer(params: AddGeoJsonLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createGeoJSONLayer(sourceSpec, show);

    this.setLayers((layers) => {
      return {
        ...layers,
        [id]: {
          name,
          show,
          type: 'geojson',
          sourceSpec,
        },
      };
    });
  }

  removeLayer(id: string) {
    this.map.deleteLayer(id);

    this.setLayers((layers) => {
      delete layers[id];
      return layers;
    });
  }

  toggleLayerVisibility(id: string) {
    this.setLayers((layers) => {
      if (layers[id].show) {
        this.map.hideLayer(id);
      } else {
        this.map.showLayer(id);
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
