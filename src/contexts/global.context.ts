import React from 'react';

import { User } from 'firebase/auth';
import { Map } from 'maplibre-gl';
import { createContext } from 'react';
import { firebaseAuth } from '../services';

type GlobalContextType = {
  map?: Map;
  setMap?: React.Dispatch<React.SetStateAction<Map | undefined>>;
  loggedUser: User | null;
  setLoggedUser?: React.Dispatch<React.SetStateAction<User | null>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  loggedUser: firebaseAuth.currentUser,
});
