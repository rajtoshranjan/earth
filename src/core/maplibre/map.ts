import { Map as MaplibreMap } from 'maplibre-gl';
import { v4 as uuid4 } from 'uuid';
import {
  CreateGeoJSONLayerSpecs,
  CreateRasterLayerSpecs,
  CreateVectorLayerSpecs,
  LayerIdsMap,
  LayerType,
  Styles,
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
      case 'vector':
        res = {
          pointLayerId: sourceId + '-vector-point-layer',
          lineLayerId: sourceId + '-vector-line-layer',
          polygonBoundaryLayerId: sourceId + '-vector-polygon-boundary-layer',
          polygonLayerId: sourceId + '-vector-polygon-layer',
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

  createVectorLayer(params: CreateVectorLayerSpecs, show = true) {
    const { id, styles, sourceLayer, ...source } = params;

    const sourceId = id ?? uuid4();
    this.addSource(sourceId, {
      ...source,
      type: 'vector',
    });

    const {
      pointLayerId,
      lineLayerId,
      polygonBoundaryLayerId,
      polygonLayerId,
    } = this._getLayerIds(sourceId, 'vector');

    // Add Point (circle).
    this.addLayer({
      id: pointLayerId,
      source: sourceId,
      'source-layer': sourceLayer,
      type: 'circle',
      // eslint-disable-next-line prettier/prettier
      filter: ['any', ['==', '$type', 'Point'], ['==', '$type', 'MultiPoint']],
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
      'source-layer': sourceLayer,
      type: 'line',
      filter: [
        'any',
        ['==', '$type', 'LineString'],
        ['==', '$type', 'MultiLineString'],
      ],
      layout: {
        visibility: show ? 'visible' : 'none',
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': styles.lineStringColor,
        'line-width': styles.lineStringWidth,
      },
    });

    // Add Polygon Fill.
    this.addLayer({
      id: polygonLayerId,
      source: sourceId,
      'source-layer': sourceLayer,
      type: 'fill',
      filter: [
        'any',
        ['==', '$type', 'Polygon'],
        ['==', '$type', 'MultiPolygon'],
      ],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'fill-color': styles.polygonFillColor,
        'fill-opacity': styles.polygonFillOpacity,
      },
    });

    // Add Polygon Outline.
    this.addLayer({
      id: polygonBoundaryLayerId,
      source: sourceId,
      'source-layer': sourceLayer,
      type: 'line',
      filter: [
        'any',
        ['==', '$type', 'Polygon'],
        ['==', '$type', 'MultiPolygon'],
      ],
      layout: {
        visibility: show ? 'visible' : 'none',
      },
      paint: {
        'line-color': styles.polygonOutlineColor,
        'line-width': styles.polygonOutlineWidth,
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

  updateGeoJSONLayerStyles(id: string, styles: Styles) {
    const {
      pointLayerId,
      lineLayerId,
      polygonBoundaryLayerId,
      polygonLayerId,
    } = this._getLayerIds(id, 'geojson');

    if (styles.pointColor !== undefined)
      this.setPaintProperty(pointLayerId, 'circle-color', styles.pointColor);
    if (styles.pointWidth !== undefined)
      this.setPaintProperty(pointLayerId, 'circle-radius', styles.pointWidth);
    if (styles.pointOutlineColor !== undefined)
      this.setPaintProperty(
        pointLayerId,
        'circle-stroke-color',
        styles.pointOutlineColor,
      );
    if (styles.pointOutlineWidth !== undefined)
      this.setPaintProperty(
        pointLayerId,
        'circle-stroke-width',
        styles.pointOutlineWidth,
      );

    if (styles.lineStringColor !== undefined)
      this.setPaintProperty(lineLayerId, 'line-color', styles.lineStringColor);
    if (styles.lineStringWidth !== undefined)
      this.setPaintProperty(lineLayerId, 'line-width', styles.lineStringWidth);

    if (styles.polygonOutlineColor !== undefined)
      this.setPaintProperty(
        polygonBoundaryLayerId,
        'line-color',
        styles.polygonOutlineColor,
      );
    if (styles.polygonOutlineWidth !== undefined)
      this.setPaintProperty(
        polygonBoundaryLayerId,
        'line-width',
        styles.polygonOutlineWidth,
      );

    if (styles.polygonFillColor !== undefined)
      this.setPaintProperty(
        polygonLayerId,
        'fill-color',
        styles.polygonFillColor,
      );
    if (styles.polygonFillOpacity !== undefined)
      this.setPaintProperty(
        polygonLayerId,
        'fill-opacity',
        styles.polygonFillOpacity,
      );
  }

  updateVectorLayerStyles(id: string, styles: Styles) {
    const {
      pointLayerId,
      lineLayerId,
      polygonBoundaryLayerId,
      polygonLayerId,
    } = this._getLayerIds(id, 'vector');

    if (styles.pointColor !== undefined)
      this.setPaintProperty(pointLayerId, 'circle-color', styles.pointColor);
    if (styles.pointWidth !== undefined)
      this.setPaintProperty(pointLayerId, 'circle-radius', styles.pointWidth);
    if (styles.pointOutlineColor !== undefined)
      this.setPaintProperty(
        pointLayerId,
        'circle-stroke-color',
        styles.pointOutlineColor,
      );
    if (styles.pointOutlineWidth !== undefined)
      this.setPaintProperty(
        pointLayerId,
        'circle-stroke-width',
        styles.pointOutlineWidth,
      );

    if (styles.lineStringColor !== undefined)
      this.setPaintProperty(lineLayerId, 'line-color', styles.lineStringColor);
    if (styles.lineStringWidth !== undefined)
      this.setPaintProperty(lineLayerId, 'line-width', styles.lineStringWidth);

    if (styles.polygonOutlineColor !== undefined)
      this.setPaintProperty(
        polygonBoundaryLayerId,
        'line-color',
        styles.polygonOutlineColor,
      );
    if (styles.polygonOutlineWidth !== undefined)
      this.setPaintProperty(
        polygonBoundaryLayerId,
        'line-width',
        styles.polygonOutlineWidth,
      );

    if (styles.polygonFillColor !== undefined)
      this.setPaintProperty(
        polygonLayerId,
        'fill-color',
        styles.polygonFillColor,
      );
    if (styles.polygonFillOpacity !== undefined)
      this.setPaintProperty(
        polygonLayerId,
        'fill-opacity',
        styles.polygonFillOpacity,
      );
  }
}
