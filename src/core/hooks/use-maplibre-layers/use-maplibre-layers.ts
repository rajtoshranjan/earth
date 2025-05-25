import { useMemo } from 'react';
import { useIndexedDbStore } from 'use-idb-store';
import { Map } from '../../maplibre';
import { LayerManager } from './layer-manager';
import { LayerInfo } from './types';

export type MaplibreLayerHookRes = {
  layers: Record<string, LayerInfo>;
  layerManager: LayerManager;
  isLoading: boolean;
};

export const useMaplibreLayers = (map: Map): MaplibreLayerHookRes => {
  // State.
  const {
    values: layers,
    mutations,
    isLoading,
    isReady,
  } = useIndexedDbStore<LayerInfo>('layers');

  // Manager.
  const layerManager = useMemo(() => {
    return new LayerManager({
      map,
      initialLayers: layers,
      layerStoreMutations: mutations,
    });
  }, [map, isReady]);

  return {
    layers,
    layerManager,
    isLoading,
  };
};
