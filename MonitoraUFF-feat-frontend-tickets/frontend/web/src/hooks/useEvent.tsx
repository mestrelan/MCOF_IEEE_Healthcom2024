import { Observable } from "ol";
import { useEffect } from "react";
import { unByKey } from "ol/Observable";

type Callback<EventType> = ((evt: EventType) => void) | undefined;

export function useEvent<EventType>(
	eventName: string,
	callback: Callback<EventType>,
	observable: Observable | undefined
) {
	useEffect(() => {
		if (!callback || !observable) return;

		// @ts-ignore
		const eventKey = observable.on(eventName, callback);

		return () => {
			unByKey(eventKey);
		};
	}, [callback, observable]);
}