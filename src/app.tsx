import { useState } from "react";
import "./assets/styles.css";

import { Map } from "maplibre-gl";

import { GlobalContext } from "./contexts";
import { Header } from "./header";
import { LayerPanel } from "./layer-panel";
import { MapView } from "./map-container";

function App() {
  // States.
  const [map, setMap] = useState<Map>();

  return (
    <GlobalContext.Provider value={{ map, setMap }}>
      <Header />
      <LayerPanel />
      <MapView />
    </GlobalContext.Provider>
  );
}

export default App;
