import "./assets/styles.css";
import {
  MaplibreExportControl,
  Size,
  PageOrientation,
  Format,
  DPI,
} from "@watergis/maplibre-gl-export";
import "@watergis/maplibre-gl-export/dist/maplibre-gl-export.css";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
  StyleSpecification,
  TerrainControl,
} from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { GlobalContext } from "./contexts";
import { LayerPanel } from "./layer-panel";
import { Header } from "./header";

const baseStyleSpec: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: ["https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"],
      tileSize: 256,
      maxzoom: 22,
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
  ],
};

function App() {
  // Refs.
  const mapContainerRef = useRef(null);

  // States.
  const [map, setMap] = useState<Map>();

  // useEffects.
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const maplibreMap = new Map({
      container: mapContainerRef.current,
      style: baseStyleSpec,
      center: [78.8718, 21.7679],
      zoom: 0,
      attributionControl: false,
    });

    maplibreMap.on("load", () => {
      maplibreMap.addSource("terrainSource", {
        type: "raster-dem",
        url:
          "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=" +
          import.meta.env.VITE_MAP_TILER_KEY,
      });
    });

    maplibreMap.addControl(
      new NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
    );
    maplibreMap.addControl(new ScaleControl({}), "bottom-left");

    maplibreMap.addControl(
      new GeolocateControl({
        showUserLocation: true,
        showAccuracyCircle: true,
      }),
      "bottom-right"
    );

    maplibreMap.addControl(
      new TerrainControl({
        source: "terrainSource",
        exaggeration: 1,
      }),
      "bottom-right"
    );
    maplibreMap.addControl(new FullscreenControl({}), "top-right");

    maplibreMap.addControl(
      // @ts-ignore
      new MaplibreExportControl({
        PageSize: Size.A4,
        PageOrientation: PageOrientation.Portrait,
        Format: Format.PNG,
        DPI: DPI[300],
        Crosshair: true,
        PrintableArea: true,
      }),
      "top-right"
    );

    setMap(maplibreMap);
  }, []);

  return (
    <GlobalContext.Provider value={{ map }}>
      <Header />
      <LayerPanel />

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-screen-container bg-gray-600"
      />
    </GlobalContext.Provider>
  );
}

export default App;
