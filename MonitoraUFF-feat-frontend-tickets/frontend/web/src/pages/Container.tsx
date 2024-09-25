import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { RegionMap } from "../region/Region";
import { DrawRegionMap } from "../region/DrawRegion";
import { apiRegion } from "../services/region";
import toast from "react-hot-toast";
import { BuildRegionMaps } from "../region/BuildRegion";

export function ContainerMaps() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get('edit');
    const api = apiRegion();
    const { id } = useParams();
    const [type, setType] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.getRegionByID(id);
                const data = response.data;
                setType(data.type_region);
            } catch (error) {
                toast.error("Error Hierarchy " + error);
            }
        }
        fetchData();
    }, [api, id]);

    return (
        type ? (
            <div>
                {paramValue ? (
                    <DrawRegionMap />
                ) : (
                    type === "EXTERNO" ? (
                        <RegionMap />
                    ) : (
                        <BuildRegionMaps />
                    )
                )}
            </div>
        ) : null
    );
}
