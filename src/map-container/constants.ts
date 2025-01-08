import { SourceSpecification, StyleSpecification } from 'maplibre-gl';
import { EnvVariables } from '../env-variables';

export const terrainSource: SourceSpecification = {
  type: 'raster-dem',
  url:
    'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=' +
    EnvVariables.mapTilerKey,
};

export const baseStyleSpec: StyleSpecification = {
  version: 8,
  projection: {
    type: ['step', ['zoom'], 'vertical-perspective', 11, 'mercator'],
  },
  sky: {
    'sky-color': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      '#1B2A4A', // Darker blue at low zoom (higher altitude)
      6,
      '#2B4B8C', // Medium blue at medium altitude
      12,
      '#4B7BE5', // Lighter blue at high zoom (lower altitude)
    ],
    'sky-horizon-blend': 0.15, // Sharper horizon line for realism
    'horizon-color': '#D4E7F7', // Subtle atmospheric haze color
    'horizon-fog-blend': 0.2, // Reduced fog for clearer horizon
    'fog-color': '#F0F8FF', // Alice blue fog for natural appearance
    'fog-ground-blend': 0.1, // Minimal ground fog for clarity
    'atmosphere-blend': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      0.5, // Less atmosphere at high altitude
      6,
      0.7, // Moderate atmosphere at medium altitude
      12,
      0.9, // More atmosphere at low altitude for realism
    ],
  },
  sources: {
    satellite: {
      type: 'raster',
      tiles: ['https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'],
      tileSize: 256,
      maxzoom: 22,
    },

    terrainSource,
  },

  layers: [
    {
      id: 'satellite',
      type: 'raster',
      source: 'satellite',
    },
  ],
};
