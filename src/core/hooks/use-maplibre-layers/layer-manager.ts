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
  layerStoreMutations: IndexedDbStoreMutations<LayerInfo>;
}

export class LayerManager {
  private readonly initialLayers: Layers;
  private readonly map: Map;
  private readonly layerStoreMutations: IndexedDbStoreMutations<LayerInfo>;

  constructor(options: IOptions) {
    this.map = options.map;
    this.initialLayers = options.initialLayers;
    this.layerStoreMutations = options.layerStoreMutations;

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
  async addRasterLayer(params: AddRasterLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createRasterLayer(sourceSpec, show);
    await this.layerStoreMutations.addValue(id, {
      name,
      show,
      type: 'raster',
      sourceSpec,
    });
    return id;
  }

  async addGeoJsonLayer(params: AddGeoJsonLayerParams, show = true) {
    const { name, ...sourceSpec } = params;
    const id = this.map.createGeoJSONLayer(sourceSpec, show);
    await this.layerStoreMutations.addValue(id, {
      name,
      show,
      type: 'geojson',
      sourceSpec,
    });
    return id;
  }

  async updateGeoJsonLayer(id: string, params: UpdateGeoJsonLayerParams) {
    const layer = await this.layerStoreMutations.getValue(id);

    if (!layer || layer?.type === 'raster') {
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

    this.layerStoreMutations.updateValue(id, {
      name: updatedName,
      sourceSpec: {
        ...layer.sourceSpec,
        data: updatedData,
      },
    });
  }

  async removeLayer(id: string) {
    this.map.deleteLayer(id);
    await this.layerStoreMutations.deleteValue(id);
  }

  async toggleLayerVisibility(id: string) {
    const layer = await this.layerStoreMutations.getValue(id);
    if (!layer) return;

    if (layer.show) {
      this.map.hideLayer(id);
    } else {
      this.map.showLayer(id);
    }

    this.layerStoreMutations.updateValue(id, { show: !layer.show });
  }

  async zoomToLayer(id: string) {
    const layer = await this.layerStoreMutations.getValue(id);
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
