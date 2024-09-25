import { createRegionZoom } from "./zoom";

export interface Region {
  id: number;
  name: string;
  acronym: string;
  image: string | null;
  description: string;
  level_type: keyof typeof createRegionZoom;
  type_region: "EXTERNO" | "INTERNO";
  polygon: PolygonGeoJson;
  upper_region: number;
  extend: string[];
}

export interface PolygonGeoJson {
  type: "FeatureCollection";
  features: PolygonFeature[];
}

interface PolygonFeature {
  type: "Feature";
  geometry: PolygonGeometry;
  properties: {
    id: number;
    name: string;
    type: string;
  };
}

interface PolygonGeometry {
  type:"LineString" | "Point";
  coordinates: number[];//NUMBER[][][]
}

export interface RegionHierarchy
  extends Pick<Region, "id" | "name" | "upper_region"> {
  children?: RegionHierarchy[];
}

export interface RegionAdd {
  name: string;
  acronym: string;
  description: string;
  image: string | null;
  extend: string[];
  type_region: string;
  level_type: string;
  polygon: object;
  upper_region: string;
}

export const REGION_DATA_INITIAL_VALUE: Region = {
  acronym: "",
  description: "",
  extend: [""],
  id: 0,
  image: null,
  level_type: "CAMPUS",
  name: "",
  polygon: {
    features: [
      {
        geometry: {
          coordinates: [[[0, 0, 0]]],
          type: "Polygon",
        },
        properties: {
          id: 0,
          name: "",
          type: "",
        },
        type: "Feature",
      },
    ],
    type: "FeatureCollection",
  },
  type_region: "EXTERNO",
  upper_region: 0,
};