import { Map } from "maplibre-gl";
import { createContext } from "react";

type GlobalContextType = {
  map?: Map;
};

export const GlobalContext = createContext<GlobalContextType>({});
