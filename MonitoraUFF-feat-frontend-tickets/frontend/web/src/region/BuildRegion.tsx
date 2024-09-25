import { BuildView } from "../map/BuildView";
import { BaseBuildLayer } from "../layers/BuildLayer";
import { FeatureLayer } from "../layers/FeatureLayer";
import { Interactions } from "../interactions/Interactions";
import { TranslateInteraction } from "../interactions/Translate";
import { RotateInteraction } from "../interactions/Rotate";
import { PopUp } from "../layers/PopUp";
import { transformCoordinates } from "../utils/TransformCoordinates";
import { apiRegion } from "../services/region";
import { useParams } from "react-router-dom";
import { PolygonGeoJson, Region } from "../models/region";
import { useEffect, useState } from "react";
import { TranslateEvent } from "ol/interaction/Translate";
import { LoadingCircle } from "../components/Loading";
import toast from "react-hot-toast";
import { Map } from "../map";
import { BuildList } from "../components/BuildList";
import Layers from "../layers/Layers";



export function BuildRegionMaps(){

    const api = apiRegion();
    const {id} = useParams()
    const [data,setData] = useState<Region>()
    const [polygons,setPolygons] = useState<PolygonGeoJson>()
    const [feature,setFeature] = useState<any>()
    const [edit,setEdit] = useState<boolean>(false)
    const [interactionType, setInteractionType] = useState<string>("modify");
    const [polygonCoordinates,setPolygonCoordinates] = useState<number[]>()
    const [polygonId,setPolygonId] = useState<number>();
    const [childs,setChilds] = useState<any>(null)

     //GETTING REGIONS
     useEffect(()=>{
        console.log("id",id)
        async function fetchData () {
            try {
                setChilds(null)
                const response = await api.getRootRegionById(id!);
                const data = response.data[0];
                console.log("data",data)
                if(response.data.length > 1){
                    setChilds(response.data.slice(1))
                }
                setData(data)
                setPolygons(data.polygon)
            } catch (error) {
                toast.error("Error Hierarchy " + error);
            }
        }
        fetchData()
    },[id])


    return (
        data ? (
            <div style={{ width: 100, height: 100 }}>
                {childs ? (
                   <BuildList childs={childs}/>
                ) : (
                    <Map>
                        <BuildView zoom={data?.level_type} />
                        <Layers>
                            <BaseBuildLayer urlImage={data?.image} />
                        </Layers>
                    </Map>
                )
            }
            </div>

        ): (
            <div className="flex justify-center items-center">
                <LoadingCircle />
            </div>
        )
    );
    
    
    
    
}