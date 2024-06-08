import { Map as MaplibreMap } from 'maplibre-gl';
import { v4 as uuid4 } from 'uuid';
import {
  CreateGeoJSONLayerSpecs,
  CreateRasterLayerSpecs,
  LayerIdsMap,
  LayerType,
} from './types';

export class Map extends MaplibreMap {
  private _getLayerIds<T extends LayerType>(
    sourceId: string,
    type: T,
  ): LayerIdsMap[T] {
    let res;

    switch (type) {
      case 'geojson':
        res = {
          pointLayerId: sourceId + '-point-layer',
          lineLayerId: sourceId + '-line-layer',
          polygonBoundaryLayerId: sourceId + '-polygon-boundary-layer',
          polygonLayerId: sourceId + '-polygon-layer',
        };
        break;
      case 'raster':
        res = sourceId + 'raster-layer';
        break;
      default:
        throw new Error('invalid type');
    }

    return res as LayerIdsMap[T];
  }

  createRasterLayer(params: CreateRasterLayerSpecs, show = true) {
    const { id, ...source } = params;

    const sourceId = id ?? uuid4();
    this.addSource(sourceId, { ...source, type: 'raster' });

    this.addLayer({
      id: this._getLayerIds(sourceId, 'raster'),
      source: sourceId,
      type: 'raster',
      layout: {
        visibility: show ? 'visible' : 'none',
      },
    });

    return sourceId;
  }

  createGeoJSONLayer(params: CreateGeoJSONLayerSpecs, show = true) {
    const { id, styles, ...source } = params;

    const sourceId = id ?? uuid4();
    this.addSource(sourceId, {
      ...source,
      type: 'geojson',
    });

    const {
      pointLayerId,
      lineLayerId,
      polygonBoundaryLayerId,
      polygonLayerId,
    } = this._getLayerIds(sourceId, 'geojson');

    // Add Point.
    this.addLayer({
      id: pointLayerId,
      source: sourceId,
      type: 'circle',
      filter: ['all', ['==', '$type', 'Point']],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'circle-color': styles.pointColor,
        'circle-radius': styles.pointWidth,
        'circle-stroke-color': styles.pointOutlineColor,
        'circle-stroke-width': styles.pointOutlineWidth,
      },
    });

    // Add Line.
    this.addLayer({
      id: lineLayerId,
      source: sourceId,
      type: 'line',
      filter: ['all', ['==', '$type', 'LineString']],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'line-color': styles.lineStringColor,
        'line-width': styles.lineStringWidth,
      },
    });

    // Add Polygon.
    this.addLayer({
      id: polygonBoundaryLayerId,
      source: sourceId,
      type: 'line',
      filter: ['all', ['==', '$type', 'Polygon']],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'line-color': styles.polygonOutlineColor,
        'line-width': styles.polygonOutlineWidth,
      },
    });

    this.addLayer({
      id: polygonLayerId,
      source: sourceId,
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon']],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'fill-color': styles.polygonFillColor,
        'fill-opacity': styles.polygonFillOpacity,
      },
    });

    return sourceId;
  }

  deleteLayer(id: string) {
    const source = this.getSource(id);

    if (!source) {
      throw new Error('Source not found');
    }

    const type = source.type as LayerType;

    const layerIds = this._getLayerIds(id, type);
    if (typeof layerIds === 'string') {
      this.removeLayer(layerIds);
    } else {
      Object.values(layerIds).forEach((layerId) => this.removeLayer(layerId));
    }

    this.removeSource(id);
  }

  setLayerVisibility(id: string, visibility: 'visible' | 'none') {
    const source = this.getSource(id);

    if (!source) {
      throw new Error('Source not found');
    }

    const type = source.type as LayerType;

    const layerIds = this._getLayerIds(id, type);
    if (typeof layerIds === 'string') {
      this.setLayoutProperty(layerIds, 'visibility', visibility);
    } else {
      Object.values(layerIds).forEach((layerId) =>
        this.setLayoutProperty(layerId, 'visibility', visibility),
      );
    }
  }

  showLayer(id: string) {
    this.setLayerVisibility(id, 'visible');
  }

  hideLayer(id: string) {
    this.setLayerVisibility(id, 'none');
  }
}
