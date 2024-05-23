import { useLocalStorage } from '@uidotdev/usehooks';
import { Map } from 'maplibre-gl';
import { useEffect, useMemo } from 'react';

import { Layers } from './types';
import { LayerManager } from './layer-manager';

export const useMaplibreLayers = (map: Map, initialLayer: Layers = {}) => {
  // State.
  const [layers, setLayers] = useLocalStorage<Layers>('layers', initialLayer);

  // Manager.
  const layerManager = useMemo(
    () => new LayerManager({ map, setLayers }),
    [setLayers, map],
  );

  // useEffects.
  useEffect(() => {
    if (!map) {
      return;
    }

    Object.entries(layers).forEach(([layerId, layerInfo]) => {
      map.addSource(layerInfo.sourceId, {
        type: 'raster',
        ...layerInfo.sourceSpec,
      });

      map.addLayer({
        id: layerId,
        source: layerInfo.sourceId,
        type: 'raster',
        layout: {
          visibility: layerInfo.show ? 'visible' : 'none',
        },
      });
    });
  }, [map]);

  return {
    layers,
    layerManager,
  };
};
