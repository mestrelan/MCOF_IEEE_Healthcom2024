import Layers from "../layers/Layers"
import { Map, View } from "../map"
import { useEffect, useState } from "react"
import { apiRegion } from "../services/region"
import { useParams } from "react-router-dom"
import { PolygonGeoJson, Region } from "../models/region"
import { LoadingCircle } from "../components/Loading"
import { BaseImageLayer } from "../layers/ImageLayer"
import { FeatureLayer } from "../layers/FeatureLayer"
import { PopUp } from "../layers/PopUp"
import { Interactions } from "../interactions/Interactions"
import { ModifyInteraction } from "../interactions/Modify"
import { ModifyEvent } from "ol/interaction/Modify"
import { TranslateEvent } from "ol/interaction/Translate"
import { TranslateInteraction } from "../interactions/Translate"
import InteractionSelector from "../components/OptionsInteraction"
import { RotateInteraction } from "../interactions/Rotate"
import { Button } from "@mui/material"
import { transformCoordinates } from "../utils/TransformCoordinates"
import toast from "react-hot-toast"

export const RegionMap = () => {

    const api = apiRegion();
    const {id} = useParams()
    const [data,setData] = useState<Region>()
    const [polygons,setPolygons] = useState<PolygonGeoJson>()
    const [feature,setFeature] = useState<any>()
    const [edit,setEdit] = useState<boolean>(false)
    const [interactionType, setInteractionType] = useState<string>("modify");
    const [polygonCoordinates,setPolygonCoordinates] = useState<number[]>()
    const [polygonId,setPolygonId] = useState<number>();

    //GETTING REGIONS
    useEffect(()=>{
        async function fetchData () {
            try {
                const response = await api.getRegionByID(id!);
                const data = response.data;
                console.log("dATRA",data)
                setData(data)
                setPolygons(data.polygon)
            } catch (error) {
                toast.error("Error Hierarchy " + error);
            }
        }
        fetchData()
    },[id])


    //DELETE FUNCTION TO DELETE FEATURE FROM POLYGONS PROPERTY
    async function handleDeletePolygonFromRegion(featureId:number){
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
        };
        data!.polygon.features = data!.polygon.features.filter(
            (feature) => feature.properties.id !== featureId,
        );
        const { id, ...dataWithoutId } = data!;
        await api.updateRegion(id, dataWithoutId, config);
        window.location.reload();
    }

    //INTERACTIONS HANDLERS
    const handleModifyEnd = (event: ModifyEvent) => {
        const coordinates = event.features.item(0).getGeometry().getCoordinates()
        console.log("Modificação terminou:", coordinates);
        setPolygonCoordinates(coordinates)
    };
  
    const onTranslateEnd = (event:TranslateEvent)=>{
        const coordinates = event.features.item(0).getGeometry().getCoordinates()
        console.log("TranslateEvent terminou:", coordinates);
        setPolygonCoordinates(coordinates)
    }

    const onRotateEnd = (event:any) =>{
        const coordinates = event.features.item(0).getGeometry().getCoordinates()
        console.log("onRotateEnd terminou:", coordinates);
        setPolygonCoordinates(coordinates)
    }

    //HANDLERS
    const handleInteractionChange = (interaction: string) => {
        setInteractionType(interaction);
    };

    function handleSeletedFeature(feature:any,polygonId:number){
        setEdit(true);
        setPolygonId(polygonId)
        setFeature(feature);
    }
    
    const handleSalvar = async () =>{
        console.log("data",data)
        console.log("polygonCoordinates",polygonCoordinates)
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
        };
        const trasnformedCoordinates = transformCoordinates(polygonCoordinates[0])
        
        const updatedFeatures = data!.polygon.features.map((feature) => {
            if (feature.properties.id === polygonId) {
                return {
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: trasnformedCoordinates
                    }
                };
            }
            return feature;
        });
        const updatedData = {
            ...data,
            polygon: {
                ...data.polygon,
                features: updatedFeatures
            }
        };

        const { id, ...dataWithoutId } = updatedData!;
        await api.updateRegion(id, dataWithoutId, config);
        window.location.reload();
    }

    return( 
        <div>
                {
                edit &&
                    <>
                        <Button  onClick={handleSalvar} >salvar</Button>
                        <InteractionSelector 
                            options={['modify', 'translate',"rotate"]} 
                            selectedOption={interactionType}
                            onChange={handleInteractionChange}
                            displayValues={{
                                'modify': 'Modificar',
                                'translate': 'Mover',
                                'rotate':'Rotacionar'
                            }}
                        />
                    </>
                }
            <div style={{ width: 100, height: 100 }}>
            {data ? (
                <Map>
                <View extend={data?.extend} zoom={data?.level_type} />
                <Layers>
                    <BaseImageLayer 
                        type={data?.type_region}
                        extend={data?.extend} 
                        urlImage={data?.image} 
                    />
                    {polygons && (
                        <FeatureLayer 
                            polygons={data.polygon} 
                        />
                    )}
                    {!edit && (
                        <PopUp 
                                    handleDeletePolygonFromRegion={handleDeletePolygonFromRegion}
                                    handleSeletedFeature={handleSeletedFeature}
                                />
                            )}
                </Layers>
                <Interactions>
                    {feature && (
                        interactionType === "modify" ? (
                                <ModifyInteraction 
                                        feature={feature} 
                                        onModifyEnd={handleModifyEnd} 
                                    />
                                ) : interactionType === "translate" ? (
                                    <TranslateInteraction 
                                        feature={feature} 
                                        onTranslateEnd={onTranslateEnd} 
                                    />
                                ) : (
                                    <RotateInteraction 
                                        feature={feature} 
                                        onRotateEnd={onRotateEnd} 
                                    />
                                )
                            )}
                        </Interactions>
            </Map>
        ) : (
            <div className="flex justify-center items-center">
                <LoadingCircle />
            </div>
)}

            </div>
        </div>
    )
}