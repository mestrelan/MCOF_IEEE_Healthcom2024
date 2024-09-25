import { ObjectEvent } from "ol/Object";
import { FC, useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts/MapContext";
import { View as OlView } from "ol";
import { useEvent } from "../hooks/useEvent";
import { regionZooms } from "../models/zoom";
import { getCenter } from "ol/extent";
import { Projection } from "ol/proj";
type Props = {
	zoom:string;
	onChangeCenter?: (evt: ObjectEvent) => void;
	onChangeResolution?: (evt: ObjectEvent) => void;
	onChangeRotation?: (evt: ObjectEvent) => void;
	onChange?: (evt: ObjectEvent) => void;
	onChangeProperty?: (evt: ObjectEvent) => void;
	onError?: (evt: ObjectEvent) => void;
};

export const BuildView: FC<Props> = ({
    zoom,
	onChangeCenter,
	onChangeResolution,
	onChangeRotation,
	onChangeProperty,
	onError,
	onChange,
}) => {
    const map = useContext(MapContext);
	const [view, setView] = useState<OlView>();

    useEffect(() => {
		if (!map) return;
		const RootRegionZoom = Object.values(regionZooms).find(region => region.name === zoom);
        if (!RootRegionZoom) {
            console.error(`Zoom value "${zoom}" not found in regionZooms.`);
            return;
        }
        const extentBuild = [0, 0, 1024, 968];
        const projection = new Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: extentBuild,
            });
		const _view = new OlView({
			center:getCenter(extentBuild),
            projection:projection,
			zoom: 2,
			maxZoom:8,
		});
		map.setView(_view);
		setView(_view);
	}, [map]);

	useEvent("change:center", onChangeCenter, view);
	useEvent("change:resolution", onChangeResolution, view);
	useEvent("change:rotation", onChangeRotation, view);
	useEvent("propertychange", onChangeProperty, view);
	useEvent("error", onError, view);
	useEvent("change", onChange, view);

	return null;
    

}