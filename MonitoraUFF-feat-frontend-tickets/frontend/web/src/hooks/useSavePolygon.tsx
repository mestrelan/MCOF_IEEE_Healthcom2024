import { apiRegion } from "../services/region";
import { transformCoordinates } from "../utils/TransformCoordinates";

interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    id: number;
    name: string;
    type: string;
  };
}

export const useSavePolygon = (
  data: any,
  selectedRegionData: any,
  coordinates: number[][],
  typeFeature: any,
) => {
  const api = apiRegion();

  console.log("selectedRegionData", selectedRegionData);

  const newCoordinates = transformCoordinates(coordinates)
  const newFeature: Feature = {
    type: "Feature",
    geometry: {
      type: typeFeature === "Polygon" ? "LineString" : "Point",
      coordinates: newCoordinates,
    },
    properties: {
      name: selectedRegionData?.name || "",
      id: selectedRegionData?.id || 0,
      type: selectedRegionData?.type_region || "",
    },
  };
  data.polygon.features.push(newFeature);

  const { id, ...dataWithoutId } = data;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("dataWithoutId", dataWithoutId);
  console.log("dat Id", data["id"]);
  api.updateRegion(data["id"], dataWithoutId, config);
};