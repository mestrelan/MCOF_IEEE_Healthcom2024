import React from "react";
import { Map } from "ol";

type MapContextType = Map | undefined;

export const MapContext = React.createContext<MapContextType>(undefined);