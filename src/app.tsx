import "./assets/scss/styles.scss";
import { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";

function App() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map = new Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json", // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
}

export default App;
