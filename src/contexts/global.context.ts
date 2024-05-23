import React, { createContext } from 'react';

import { User } from 'firebase/auth';
import { Map } from 'maplibre-gl';
import { firebaseAuth } from '../services';
import { Layers, LayerManager } from '../utils/hooks';

type GlobalContextType = {
  map?: Map;
  setMap?: React.Dispatch<React.SetStateAction<Map | undefined>>;
  loggedUser: User | null;
  setLoggedUser?: React.Dispatch<React.SetStateAction<User | null>>;
  layers?: Layers;
  layerManager?: LayerManager;
};

export const GlobalContext = createContext<GlobalContextType>({
  loggedUser: firebaseAuth.currentUser,
});
