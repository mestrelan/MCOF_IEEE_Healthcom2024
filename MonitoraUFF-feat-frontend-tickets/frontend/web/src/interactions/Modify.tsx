import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import { Collection, Feature } from "ol";
import { Fill, Stroke, Style } from "ol/style";
import {Modify} from "ol/interaction"
import { useEvent } from "../hooks/useEvent";
import { ModifyEvent } from "ol/interaction/Modify";
import { Point } from "ol/geom";

interface ModifyInteractionProps {
    feature: Feature<any>;
    onModifyEnd?: (event: ModifyEvent) => void;
}

export function ModifyInteraction({feature,onModifyEnd}:ModifyInteractionProps){

    const map = useContext(MapContext);
    const [modify, setmodify] = useState<Modify>();

    useEffect(()=>{
        if(!map)return;
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
            console.log("é POINTS")
        }else{
            const blueStyle = new Style({
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.5)', 
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.8)', 
                    width: 2,
                }),
            });
            feature.setStyle(blueStyle);
            const modifyInteraction = new Modify({
                features: new Collection([feature]),
            });
    
            map.addInteraction(modifyInteraction)
            setmodify(modifyInteraction);
            map.getViewport().style.cursor = 'pointer';
            
             return(()=>{
                 map.removeInteraction(modifyInteraction)
                 map.getViewport().style.cursor = '';
             })
        }
        
    },[map,feature])

    useEffect(() => {
        if (!modify) return;
        modify.setActive(!!onModifyEnd);
    }, [onModifyEnd, modify]);

    useEvent("modifyend", onModifyEnd, modify);
    return null;
}