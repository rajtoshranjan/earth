import * as turf from '@turf/turf';
import { LngLatBoundsLike } from 'maplibre-gl';
import { IndexedDbStoreMutations } from 'use-idb-store';
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
  getLayer: (id: string) => LayerInfo | undefined;
  layerMutations: IndexedDbStoreMutations<LayerInfo>;
}

export class LayerManager {
  private readonly initialLayers: Layers;
  private readonly getLayer: (id: string) => LayerInfo | undefined;
  private readonly map: Map;
  private readonly layerMutations: IndexedDbStoreMutations<LayerInfo>;

  constructor(options: IOptions) {
    this.map = options.map;
    this.initialLayers = options.initialLayers;
    this.getLayer = options.getLayer;
    this.layerMutations = options.layerMutations;

    if (this.map) {
      this._loadInitialLayers();
    }
  }

  // Initialize layers on construction.
  private _loadInitialLayers() {
    Object.entries(this.initialLayers).forEach(([id, layerInfo]) => {
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

  // Public methods to manage layers.
  addRasterLayer(params: AddRasterLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createRasterLayer(sourceSpec, show);
    this.layerMutations.setValue(id, {
      name,
      show,
      type: 'raster',
      sourceSpec,
    });
    return id;
  }

  addGeoJsonLayer(params: AddGeoJsonLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createGeoJSONLayer(sourceSpec, show);
    this.layerMutations.setValue(id, {
      name,
      show,
      type: 'geojson',
      sourceSpec,
    });
    return id;
  }

  updateGeoJsonLayer(id: string, params: UpdateGeoJsonLayerParams) {
    const layer = this.getLayer(id);

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

    this.layerMutations.setValue(id, {
      ...layer,
      name: updatedName,
      sourceSpec: {
        ...layer.sourceSpec,
        data: updatedData,
      },
    });
  }

  removeLayer(id: string) {
    this.map.deleteLayer(id);
    this.layerMutations.deleteValue(id);
  }

  toggleLayerVisibility(id: string) {
    const layer = this.getLayer(id);
    if (!layer) return;

    if (layer.show) {
      this.map.hideLayer(id);
    } else {
      this.map.showLayer(id);
    }

    this.layerMutations.updateValue(id, { ...layer, show: !layer.show });
  }

  zoomToLayer(id: string) {
    const layer = this.getLayer(id);
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
