import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import ImageLayer from "ol/layer/Image"
import Static from "ol/source/ImageStatic";
import { fromProjection, toProjection } from "../models/constants";
import { Projection, transformExtent } from "ol/proj";

interface BaseImageLayerProps{
    urlImage: string | null;
    extend: string[];
}

export function BaseImageLayer({urlImage,extend}:BaseImageLayerProps){

    const map = useContext(MapContext);
    const [layer, setLayer] = useState<any | null>(null);

    useEffect(()=>{
        if (!map) return;
        const mapExtend = extend.map(parseFloat);
        const transformedExtent = transformExtent(mapExtend, fromProjection, toProjection);
        if(!urlImage) return;
      
      
            
           const imageLayer = new ImageLayer({
                source: new Static({
                    url:urlImage,
                    projection: toProjection,
                    imageExtent:transformedExtent
                })
            })
       
        map.addLayer(imageLayer);
		setLayer(imageLayer);
        return () => {
			if (map) {
				map.removeLayer(imageLayer);
			}
		};
    },[map,urlImage,extend])


    return null;
}