import { useEffect, useMemo } from 'react';
import { useIndexedDbStore } from 'use-idb-store';
import { useLocalStorage } from 'usehooks-ts';
import { Map } from '../../maplibre';
import { LayerManager } from './layer-manager';
import { LayerInfo, Layers } from './types';

export const useMaplibreLayers = (map: Map) => {
  // State.
  const {
    values: layers,
    mutations,
    isLoading,
  } = useIndexedDbStore<LayerInfo>('layers');

  // ** Migration start **
  /**
   * Migration from localStorage to IndexedDB
   *
   * This code handles the migration of layer data from localStorage to IndexedDB.
   * It will be removed in the next major release.
   */
  const [oldLayers, setOldLayers] = useLocalStorage<Layers>('layers', {});

  useEffect(() => {
    const migrateLayersToIndexedDB = async () => {
      if (!oldLayers || isLoading) return;

      // Migrate each layer from localStorage to IndexedDB
      for (const [id, layer] of Object.entries(oldLayers)) {
        await mutations.addValue(id, layer);
      }

      // Clear localStorage after migration
      setOldLayers({});
    };

    migrateLayersToIndexedDB();
  }, [oldLayers, isLoading]);
  // ** Migration end **

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
