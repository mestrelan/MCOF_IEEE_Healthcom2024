import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import { Collection, Feature } from "ol";
import { Fill, Stroke, Style } from "ol/style";
import { useEvent } from "../hooks/useEvent";
import { Translate } from "ol/interaction";
import { TranslateEvent } from "ol/interaction/Translate";

interface TranslateInteractionProps {
    feature: Feature<any>;
    onTranslateEnd?: (event: TranslateEvent) => void;
}

export function TranslateInteraction({feature,onTranslateEnd}:TranslateInteractionProps){

    const map = useContext(MapContext);
    const [translate, setTranslate] = useState<Translate>();

    useEffect(()=>{
        if(!map)return;
        const  translateInteraction = new Translate({
            features: new Collection([feature]),
        });

        map.addInteraction(translateInteraction)
        setTranslate(translateInteraction);

        return(()=>{
            map.removeInteraction(translateInteraction)
            map.getViewport().style.cursor = '';
        })
        
    },[map,feature])

    useEffect(() => {
        if(!map) return;
        if (!translate) return;
        translate.setActive(!!onTranslateEnd);
    
        const mouseMoveHandler = (event: MouseEvent) => {
          const pixel = map.getEventPixel(event);
          const hit = map.hasFeatureAtPixel(pixel);
          map.getTarget()!.style.cursor = hit ? 'move' : '';
        };
    
        map.getViewport().addEventListener('mousemove', mouseMoveHandler);
    
        return () => {
          map.getViewport().removeEventListener('mousemove', mouseMoveHandler);
        };
      }, [onTranslateEnd, translate, map]);

    useEvent("translateend", onTranslateEnd, translate);
    return null;
}