import React, { createContext } from 'react';

import { User } from 'firebase/auth';
import { LayerManager, Layers } from '../core/hooks';
import { Map } from '../core/maplibre';
import { firebaseAuth } from '../services';

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
