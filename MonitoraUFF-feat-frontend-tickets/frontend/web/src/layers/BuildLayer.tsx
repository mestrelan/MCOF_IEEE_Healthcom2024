import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import ImageLayer from "ol/layer/Image"
import Static from "ol/source/ImageStatic";
import { Projection } from "ol/proj";

interface BaseBuildLayerProps{
    urlImage: string | null;
}

export function BaseBuildLayer({urlImage}:BaseBuildLayerProps){

    const map = useContext(MapContext);
    const [layer, setLayer] = useState<any | null>(null);

    useEffect(()=>{
        console.log("urlImage",urlImage)
        if (!map) return;
        // if(!urlImage) return;
            const extentBuild = [0, 0, 1024, 968];
            const projection = new Projection({
                code: 'xkcd-image',
                units: 'pixels',
                extent: extentBuild,
            });
            const imageLayer = new ImageLayer({
                source: new Static({
                    url:urlImage,
                    projection: projection,
                    imageExtent:extentBuild
                })
            })
        
        map.addLayer(imageLayer);
		setLayer(imageLayer);
        return () => {
			if (map) {
				map.removeLayer(imageLayer);
			}
		};
    },[map,urlImage])


    return null;
}