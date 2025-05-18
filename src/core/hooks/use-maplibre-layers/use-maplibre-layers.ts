import { useMemo } from 'react';
import { useIndexedDbStore } from 'use-idb-store';
import { Map } from '../../maplibre';
import { LayerManager } from './layer-manager';
import { LayerInfo } from './types';

export const useMaplibreLayers = (map: Map) => {
  // State.
  const {
    values: layers,
    mutations,
    isLoading,
  } = useIndexedDbStore<LayerInfo>('layers');

  // Manager.
  const layerManager = useMemo(
    () =>
      new LayerManager({
        map,
        initialLayers: layers,
        layerStoreMutations: mutations,
      }),
    [map, isLoading],
  );

  return {
    layers,
    layerManager,
    isLoading,
  };
};
