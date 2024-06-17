import { useState } from 'react';
import './assets/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { GlobalContext } from './contexts';
import { useMaplibreLayers } from './core/hooks';
import { Map } from './core/maplibre';
import { Header } from './header';
import { LayerPanel } from './layer-panel';
import { MapView } from './map-container';

// React query client.
const queryClient = new QueryClient();

function App() {
  // States.
  const [map, setMap] = useState<Map>();
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  // Hooks.
  const { layers, layerManager } = useMaplibreLayers(map as Map);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider
        value={{ map, setMap, loggedUser, setLoggedUser, layers, layerManager }}
      >
        <Header />
        <LayerPanel />
        <MapView />
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
