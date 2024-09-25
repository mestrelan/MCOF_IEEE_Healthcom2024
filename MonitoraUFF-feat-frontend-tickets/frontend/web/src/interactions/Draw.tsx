import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import { Type } from "ol/render/Feature";
import { useEvent } from "../hooks/useEvent";

interface DrawInteractionProps{
    typeFeature:Type;
    onDrawStart?: (event: DrawEvent) => void;
    onDrawEnd?: (event: DrawEvent) => void;
}

export function DrawInteraction({typeFeature,onDrawStart,onDrawEnd}:DrawInteractionProps){

    const map = useContext(MapContext);
    const [draw, setDraw] = useState<Draw>();

    useEffect(()=>{
        if(!map) return;
        const source = new VectorSource()
        const vector = new VectorLayer({
            source: source,
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.2)',
                'stroke-color': '#ffcc33',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#ffcc33',
            },
        });
        const draw = new Draw({
            source: source,
            type: typeFeature,
        });
        map.addInteraction(draw)
        setDraw(draw);
        map.addLayer(vector);
        return(()=>{
            map.removeInteraction(draw);
            map.removeLayer(vector);
        })
    },[map,typeFeature])

    useEvent("drawend", onDrawEnd, draw);
	useEvent("drawstart", onDrawStart, draw);

    return null;
}