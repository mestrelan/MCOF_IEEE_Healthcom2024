import { MapContext } from "../contexts/MapContext";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Region, RegionHierarchy } from "../models/region";
import HierarchyRegion from "../utils/HierarchyRegion";
import { apiRegion } from "../services/region";

// interface IGeoJsonFeatureCollection {
//   type: string;
//   features: Array<Feature>;
// }

export const useRegion = () => {
  const [region, setRegion] = useState<any>({});
  const [allRegions, setAllRegions] = useState<Region[]>([]);
  const [hierarchy, setHierarchy] = useState<RegionHierarchy[]>([]);



  const { getAllRegions, addRegion, getRegion } = apiRegion();

  const Hierarchy = async () => {
    try {
      const response = await getAllRegions();
      const hierarchy = HierarchyRegion(response.data);
      setAllRegions(response.data);
      setHierarchy(hierarchy);
    } catch (error) {
        toast.error("Error Hierarchy " + error);
    }
  };

  const createRegion = async (newRegion: any) => {
    try {
      const response = await addRegion(newRegion);
      setRegion(response.data);
      toast.success("Region Created");
    } catch (error) {
      toast.error("Create Region Failure " + error);
    }
  };


  return {
    allRegions,
    hierarchy,
    region,
    Hierarchy,
    createRegion,
  };
};