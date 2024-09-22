import React, { createContext } from 'react';

import { LayerManager, Layers } from '../core/hooks';
import { Map } from '../core/maplibre';

type GlobalContextType = {
  map?: Map;
  setMap?: React.Dispatch<React.SetStateAction<Map | undefined>>;
  layers?: Layers;
  layerManager?: LayerManager;
  editingLayerId?: string;
  setEditingLayerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const GlobalContext = createContext<GlobalContextType>({});
