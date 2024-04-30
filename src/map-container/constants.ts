import { SourceSpecification, StyleSpecification } from "maplibre-gl";

export const terrainSource: SourceSpecification = {
  type: "raster-dem",
  url:
    "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=" +
    import.meta.env.VITE_MAP_TILER_KEY,
};

export const baseStyleSpec: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: ["https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"],
      tileSize: 256,
      maxzoom: 22,
    },

    terrainSource,
  },

  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
  ],
};
