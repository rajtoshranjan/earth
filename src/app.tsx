import "./assets/scss/styles.scss";
import {
  Map,
  NavigationControl,
  StyleSpecification,
  TerrainControl,
} from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

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
      new TerrainControl({
        source: "terrainSource",
        exaggeration: 1,
      })
    );

    maplibreMap.on("load", () => {
      maplibreMap.addSource("terrain", {
        type: "raster-dem",
        url:
          "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=" +
          import.meta.env.VITE_MAP_TILER_KEY,
      });
      maplibreMap.setTerrain({
        source: "terrain",
        exaggeration: 2.5,
      });
    });

    setMap(map);
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
}

export default App;
