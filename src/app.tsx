import { useState } from "react";
import "./assets/styles.css";

import { Map } from "maplibre-gl";

import { GlobalContext } from "./contexts";
import { Header } from "./header";
import { LayerPanel } from "./layer-panel";
import { MapView } from "./map-container";
import { User } from "firebase/auth";

function App() {
  // States.
  const [map, setMap] = useState<Map>();
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  return (
    <GlobalContext.Provider value={{ map, setMap, loggedUser, setLoggedUser }}>
      <Header />
      <LayerPanel />
      <MapView />
    </GlobalContext.Provider>
  );
}

export default App;
