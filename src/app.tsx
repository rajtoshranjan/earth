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

import { Draw } from "./draw";
import { GlobalContext } from "./context";
import { Header, SideNav } from "./components";

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
      attributionControl: false,
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
      <Header />
      <div className="flex h-screen w-full dark:bg-gray-900">
        <SideNav />
        <div className="w-full" style={{ height: "calc(100vh - 60px)" }}>
          <div ref={mapContainerRef} className="w-full  h-full" />
          <Draw />
        </div>
      </div>
    </GlobalContext.Provider>
  );
}

export default App;
