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
    type: [
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      'vertical-perspective',
      12,
      'mercator',
    ],
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
    standard: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    },
    light: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 20,
      attribution: '&copy; CARTO',
    },
    dark: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 20,
      attribution: '&copy; CARTO',
    },

    terrainSource,
  },

  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#111827',
      },
    },
    {
      id: 'satellite',
      type: 'raster',
      source: 'satellite',
      layout: {
        visibility: 'visible',
      },
    },
    {
      id: 'standard',
      type: 'raster',
      source: 'standard',
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'light',
      type: 'raster',
      source: 'light',
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'dark',
      type: 'raster',
      source: 'dark',
      layout: {
        visibility: 'none',
      },
    },
  ],
};
