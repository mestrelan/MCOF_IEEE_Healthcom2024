import { View as OlView } from "ol";
import { FC, useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts/MapContext";
import { useEvent } from "../hooks/useEvent";
import { ObjectEvent } from "ol/Object";
import { regionZooms } from "../models/zoom";
import { fromProjection, toProjection } from "../models/constants";
import { getCenter } from "ol/extent";
import { transform } from "ol/proj";

type Props = {
	extend: string[];
	zoom:string;
	onChangeCenter?: (evt: ObjectEvent) => void;
	onChangeResolution?: (evt: ObjectEvent) => void;
	onChangeRotation?: (evt: ObjectEvent) => void;
	onChange?: (evt: ObjectEvent) => void;
	onChangeProperty?: (evt: ObjectEvent) => void;
	onError?: (evt: ObjectEvent) => void;
};

export const View: FC<Props> = ({
	extend,
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
		const mapExtend = extend.map(parseFloat);

		const _view = new OlView({
			center:transform(getCenter(mapExtend), fromProjection, toProjection),
			zoom:RootRegionZoom!.zoom[0],
			minZoom:RootRegionZoom!.zoom[1],
			maxZoom:RootRegionZoom!.zoom[2],
		});
		map.setView(_view);
		setView(_view);
	}, [map, extend]);

	useEvent("change:center", onChangeCenter, view);
	useEvent("change:resolution", onChangeResolution, view);
	useEvent("change:rotation", onChangeRotation, view);
	useEvent("propertychange", onChangeProperty, view);
	useEvent("error", onError, view);
	useEvent("change", onChange, view);

	return null;
};

export default View;
export type { Props as ViewProps };