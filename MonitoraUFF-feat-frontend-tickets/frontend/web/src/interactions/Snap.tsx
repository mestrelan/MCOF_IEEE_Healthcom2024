import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import { Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";


interface SnapInteractionProps{

}

export function SnapInteraction(){

    const map = useContext(MapContext);
    const [snap, setSnap] = useState<Snap>();

    useEffect(()=>{
        if (!map) return;
        const source = new VectorSource();
        const snap = new Snap({
            source:source
        })
        map.addInteraction(snap);
        setSnap(snap)
        return () => {
			map.removeInteraction(snap);
		};
    },[map])

    useEffect(() => {
		if (!snap) return;
	}, [ snap]);

    return null;
}