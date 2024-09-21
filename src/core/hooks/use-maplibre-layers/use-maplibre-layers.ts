import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Map } from '../../maplibre';

import { LayerManager } from './layer-manager';
import { Layers } from './types';

export const useMaplibreLayers = (map: Map, initialLayer: Layers = {}) => {
  // State.
  const [layers, setLayers] = useLocalStorage<Layers>('layers', initialLayer);

  // Manager.
  const layerManager = useMemo(
    () => new LayerManager({ map, initialLayers: layers, setLayers }),
    [map],
  );

  return {
    layers,
    layerManager,
  };
};
