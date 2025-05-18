import { useState } from 'react';
import './assets/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
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
  const [editingLayerId, setEditingLayerId] = useState<string>();

  // Hooks.
  const {
    layers,
    layerManager,
    isLoading: isLayerLoading,
  } = useMaplibreLayers(map as Map);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider
        value={{
          map,
          setMap,
          layers,
          isLayerLoading,
          layerManager,
          editingLayerId,
          setEditingLayerId,
        }}
      >
        <Header />
        <LayerPanel />
        <MapView />
      </GlobalContext.Provider>

      {/* Toaster setup */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: '#111827',
            color: '#f9fafb',
            paddingRight: 0,
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
