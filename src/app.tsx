import "./assets/scss/styles.scss";
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

import { Draw } from "./draw";
import { GlobalContext } from "./context";

const baseStyleSpec: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: ["https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"],
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
    });

    maplibreMap.addControl(
      new NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      })
    );

    maplibreMap.addControl(
      new GeolocateControl({ showUserLocation: true, showAccuracyCircle: true })
    );

    maplibreMap.addControl(
      new TerrainControl({
        source: "terrainSource",
        exaggeration: 1,
      })
    );
    maplibreMap.addControl(new FullscreenControl({}));
    maplibreMap.addControl(new ScaleControl({}));

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

    maplibreMap.on("load", () => {
      maplibreMap.addSource("terrainSource", {
        type: "raster-dem",
        url:
          "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=" +
          import.meta.env.VITE_MAP_TILER_KEY,
      });
      maplibreMap.setTerrain({
        source: "terrainSource",
        exaggeration: 2.5,
      });
    });

    setMap(maplibreMap);
  }, []);

  return (
    <GlobalContext.Provider value={{ map }}>
      <div ref={mapContainerRef} className="map-container" />;
      <Draw />
    </GlobalContext.Provider>
  );
}

export default App;
