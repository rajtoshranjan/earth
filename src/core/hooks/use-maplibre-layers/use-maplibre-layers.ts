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

  // Hanlders.
  const getLayer = (id: string) => layers[id];

  // Manager.
  const layerManager = useMemo(
    () =>
      new LayerManager({
        map,
        initialLayers: layers,
        getLayer,
        layerMutations: mutations,
      }),
    [map, isLoading],
  );

  return {
    layers,
    layerManager,
    isLoading,
  };
};
