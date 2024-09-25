import React, { FunctionComponent,MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react'
import * as ol from "ol";
import { MapContext } from '../contexts/MapContext';

interface MapProps{
  mapRef?: MutableRefObject<ol.Map>;
	onMouseMove?: (event: any) => void;
  children:ReactElement;
}

type MapRef = ol.Map | undefined;

export const Map :FunctionComponent<MapProps>  =  ({
  children,
  onMouseMove,
  mapRef,
}) => {

  	const mapEl = useRef<HTMLDivElement>(null);

	const [map, setMap] = useState<MapRef>(undefined);

  	useEffect(()=>{
		if (!mapEl.current) return;
			const options = {
				layers: [],
				controls: [],
				overlays: [],
			};
			const mapObject = new ol.Map(options);
			mapObject.setTarget(mapEl.current);
			setMap(mapObject);
			if (mapRef) {
				mapRef.current = mapObject;
			}
			return () => mapObject.setTarget(undefined);  
	},[])

  return (
    <MapContext.Provider value={map}>
		<div ref={mapEl} className="ol-map">
			{children}
		</div>
	</MapContext.Provider>
  )
}
