import { useEffect, useState } from "react";
import { LoadingCircle } from "../components/Loading";
import { FeatureLayer } from "../layers/FeatureLayer";
import { BaseImageLayer } from "../layers/ImageLayer";
import Layers from "../layers/Layers";
import { Map, View } from "../map";
import { apiRegion } from "../services/region";
import { useNavigate, useParams } from "react-router-dom";
import { PolygonGeoJson, Region } from "../models/region";
import { EditBar } from "../components/EditBar";
import { Interactions } from "../interactions/Interactions";
import { SnapInteraction } from "../interactions/Snap";
import { DrawInteraction } from "../interactions/Draw";
import { DrawEvent } from "ol/interaction/Draw";
import toast from "react-hot-toast";
import { CreateRegionModal } from "../components/CreateRegionModal";
import { ModalAddFeatureToPolygon } from "../components/ModalAddFeatureToPolygon";


export function DrawRegionMap(){

    const navigate = useNavigate();
    const api = apiRegion();
    const {id} = useParams()
    const [data,setData] = useState<Region>()
    const [polygons,setPolygons] = useState<PolygonGeoJson>()
    const [typeFeature,setTypeFeature] = useState<any>("Polygon")
    const [childs,setChilds] = useState<any>()
    const [open,setOpen] = useState<boolean>(false)
    const [coordinates,setCoordinates] = useState<any>()

    useEffect(()=>{
        async function fetchData () {
            try {
                const response = await api.getRootRegionById(id!);
                const data = response.data[0];
                // if(response.data.length > 1){
                // }
                console.log("data draw",data)
                setChilds(response.data.slice(1))
                setData(data)
                setPolygons(data.polygon)
            } catch (error) {
                console.log("ERROR ",error)
            }
        }
        fetchData()
    },[id])

    function handleTypeFeature(typeFeature:any){
        setTypeFeature(typeFeature)
    }

    async function handleDeleteRegion(){
        try{
            await api.deleteRegion(data?.id);
            toast.success("Região deletada.");
            navigate(`/home`)
            window.location.reload()
          }catch(error){
            toast.error("Não foi possível deletar a região.");
        }
    }

    async function handleUpdateRegion(updateData:Region){
        try {
            const { id, ...dataWithoutId } = updateData!;
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
            };
            await api.updateRegion(id,dataWithoutId,config)
            toast.success("Região deletada.");
            navigate(`/home`)
            window.location.reload()
        } catch (error) {
            toast.error("Não foi possível salvar as modificações");
        }
    }

    const onDrawStart = (event:DrawEvent)=>{
        console.log("onDrawStart ", event);
        
    }

    function onClose(){
        setOpen(false)
    }

    const onDrawEnd = (event:any) =>{
        const geometry = event.feature.getGeometry();
        const coordinates = geometry.getFlatCoordinates();
        console.log("onDrawEnd ", coordinates);
        const pairs = [];
        for (let i = 0; i < coordinates.length; i++) {
            pairs.push([coordinates[i], coordinates[i + 1]]);
            i++; 
        }
        setCoordinates(pairs)
        
        setOpen(true)
    
    }

    return(
        <div>
            <div style={{ width: 100, height: 100 }}>
                {polygons && data ? (
                    <Map>
                        <View extend={data?.extend} zoom={data?.level_type} />
                        <Layers>
                            <BaseImageLayer extend={data?.extend} urlImage={data?.image} />
                            <FeatureLayer polygons={data.polygon} />
                        </Layers>
                        <Interactions>
                            <SnapInteraction/>
                            {
                                typeFeature &&
                                    <DrawInteraction 
                                        typeFeature={typeFeature} 
                                        onDrawStart={onDrawStart} 
                                        onDrawEnd={onDrawEnd}
                                    />
                            }
                        </Interactions>
                    </Map>
                ) : (
                    <div className="flex justify-center items-center">
                        <LoadingCircle />
                    </div>
                )}
            </div>
            {
                data &&
                <EditBar 
                    regionData={data}  
                    handleTypeFeature={handleTypeFeature}
                    handleDeleteRegion={handleDeleteRegion}
                    handleUpdateRegion={handleUpdateRegion}
                />
            }
            {
                coordinates && 
                <ModalAddFeatureToPolygon    
                            open={open}
                            onClose={onClose}
                            childs={childs}
                            coordinates={coordinates}
                            data={data}
                            typeFeature={typeFeature}
                        />  
            }
        </div>
    )
}