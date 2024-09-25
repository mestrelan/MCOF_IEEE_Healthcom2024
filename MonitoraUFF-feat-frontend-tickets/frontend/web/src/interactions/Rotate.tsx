import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import { Collection, Feature } from "ol";
import RotateFeatureInteraction from 'ol-rotate-feature';
import { useEvent } from "../hooks/useEvent";
import { Point } from "ol/geom";

interface RotateEvent {
    type: string; 
    feature: Feature<any>; 
}

interface RotateInteractionProps {
    feature: Feature<any>;
    onRotateEnd?: (event: RotateEvent) => void;
}


export function RotateInteraction({feature,onRotateEnd}:RotateInteractionProps){

    const map = useContext(MapContext);
    const [rotate,setRotate] = useState<any>()

    useEffect(()=>{
        if(!map) return;
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
            const rotateInteraction = new RotateFeatureInteraction({
                features: new Collection([feature]),
            });
            const geometry = feature.getGeometry();
            rotateInteraction.on('rotating', function (event) {
                const rotatedFeature = event.features.getArray()[0];
                if (rotatedFeature) {
                    console.log("angle", event.angle);
                    feature.getStyle().getImage().setRotation(event.angle * Math.PI);
                    const changedCoordinates = rotatedFeature.getGeometry().getCoordinates();
                    console.log("rotating ", changedCoordinates);
                }
            });
            map.addInteraction(rotateInteraction)
            setRotate(rotateInteraction);
            return(()=>{
                map.removeInteraction(rotateInteraction)
            })
        }else{
            const rotateInteraction = new RotateFeatureInteraction({
                features: new Collection([feature]),
            });
            map.addInteraction(rotateInteraction)
            setRotate(rotateInteraction);
            return(()=>{
                map.removeInteraction(rotateInteraction)
            })
        }
    },[map])

    useEffect(() => {
        if (!rotate) return;
        rotate.setActive(!!onRotateEnd);
    }, [onRotateEnd, rotate]);

    useEvent("rotateend", onRotateEnd, rotate);

    return null;
}