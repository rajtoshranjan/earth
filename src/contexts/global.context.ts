import { Map } from "maplibre-gl";
import { createContext } from "react";

type GlobalContextType = {
  map?: Map;
  setMap?: React.Dispatch<React.SetStateAction<Map | undefined>>;
};

export const GlobalContext = createContext<GlobalContextType>({});
