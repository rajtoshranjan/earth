import * as turf from '@turf/turf';
import { LngLatBoundsLike } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';
import { Map } from '../../maplibre';
import {
  AddGeoJsonLayerParams,
  AddRasterLayerParams,
  LayerInfo,
  Layers,
  UpdateGeoJsonLayerParams,
} from './types';

interface IOptions {
  map: Map;
  initialLayers: Layers;
  setLayers: Dispatch<SetStateAction<Layers>>;
}

export class LayerManager {
  private layers: Layers;
  private readonly map: Map;
  private readonly setLayers: Dispatch<SetStateAction<Layers>>;

  constructor(options: IOptions) {
    this.map = options.map;
    this.layers = options.initialLayers;
    this.setLayers = options.setLayers;

    if (this.map) {
      this._loadInitialLayers();
    }
  }

  // Initialize layers on construction.
  private _loadInitialLayers() {
    Object.entries(this.layers).forEach(([id, layerInfo]) => {
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

  // State and layers update methods.
  private _updateLayers(layers: Layers) {
    this.layers = layers;
    this.setLayers(layers);
  }

  private _addLayer(id: string, layerInfo: LayerInfo) {
    this._updateLayers({ ...this.layers, [id]: layerInfo });
  }

  private _deleteLayer(id: string) {
    delete this.layers[id];
    this.setLayers(this.layers);
  }

  // Public methods to manage layers.
  addRasterLayer(params: AddRasterLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createRasterLayer(sourceSpec, show);
    this._addLayer(id, { name, show, type: 'raster', sourceSpec });
    return id;
  }

  addGeoJsonLayer(params: AddGeoJsonLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createGeoJSONLayer(sourceSpec, show);
    this._addLayer(id, { name, show, type: 'geojson', sourceSpec });
    return id;
  }

  updateGeoJsonLayer(id: string, params: UpdateGeoJsonLayerParams) {
    const layer = this.layers[id];

    if (!layer || layer.type === 'raster') {
      throw new Error('Wrong layer type or layer does not exist');
    }

    const { name, data, ...sourceSpec } = params;
    const updatedData = data ?? layer.sourceSpec.data;
    const updatedName = name ?? layer.name;

    // Only recreate the layer if the data has changed.
    if (data) {
      this.map.deleteLayer(id);
      this.map.createGeoJSONLayer(
        { ...layer.sourceSpec, id, data: updatedData, ...sourceSpec },
        layer.show,
      );
    }

    this._updateLayers({
      ...this.layers,
      [id]: {
        ...layer,
        name: updatedName,
        sourceSpec: {
          ...layer.sourceSpec,
          data: updatedData,
        },
      },
    });
  }

  removeLayer(id: string) {
    this.map.deleteLayer(id);
    this._deleteLayer(id);
  }

  toggleLayerVisibility(id: string) {
    const layer = this.layers[id];
    if (!layer) return;

    if (layer.show) {
      this.map.hideLayer(id);
    } else {
      this.map.showLayer(id);
    }

    this._updateLayers({
      ...this.layers,
      [id]: { ...layer, show: !layer.show },
    });
  }

  zoomToLayer(id: string) {
    const layer = this.layers[id];
    if (!layer) return;

    let bounds: LngLatBoundsLike | undefined;

    if (layer.type === 'geojson' && typeof layer.sourceSpec.data !== 'string') {
      const bbox = turf.bbox(layer.sourceSpec.data);
      bounds = [bbox[0], bbox[1], bbox[2], bbox[3]];
    } else if (layer.type === 'raster') {
      bounds = layer.sourceSpec.bounds;
    }

    if (bounds) {
      this.map.fitBounds(bounds, { padding: 20 });
    }
  }
}
