import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
  TerrainControl,
} from "maplibre-gl";

export const setupMapControls = (map: Map) => {
  map.addControl(
    new NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true,
    }),
    "bottom-right"
  );

  map.addControl(
    new GeolocateControl({
      showUserLocation: true,
      showAccuracyCircle: true,
    }),
    "bottom-right"
  );

  map.addControl(
    new TerrainControl({
      source: "terrainSource",
      exaggeration: 1,
    }),
    "bottom-right"
  );

  map.addControl(new FullscreenControl({}), "bottom-right");

  map.addControl(new ScaleControl({}), "bottom-left");
};
