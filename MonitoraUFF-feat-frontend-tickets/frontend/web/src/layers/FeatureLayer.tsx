import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map";
import { PolygonGeoJson } from "../models/region";
import { Fill, Icon, Stroke, Style } from "ol/style";
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { transform } from "ol/proj";
import { Point, Polygon } from "ol/geom";
import { fromProjection, toProjection } from "../models/constants";
import CameraIconGreen from "../assets/icons/camera-green.png"
import { transformPolygonsCoordinates } from "../utils/TransformCoordinates";


interface FeatureLayerProps{
    polygons:PolygonGeoJson;
}

export function FeatureLayer({polygons}:FeatureLayerProps){

    const map = useContext(MapContext);
    const [layer, setLayer] = useState<any | null>(null);


 

    useEffect(()=>{
        if (!map) return; 
        const areaLayer = new VectorLayer({
            source: new VectorSource(),
        });
        polygons.features.forEach(feature =>{
            if(feature.geometry.type == "LineString"){
                let coordinates = transformPolygonsCoordinates(feature.geometry.coordinates);
                var poligono = new Polygon([coordinates]);
                var featurePoligono = new Feature({
                    geometry: poligono,
                    id: feature.properties.id,
                    name:feature.properties.name,
                    type: feature.properties.type
                });
                var estiloPoligono = new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.2)'
                    })
                });
                featurePoligono.setStyle(estiloPoligono);
                areaLayer.getSource()!.addFeature(featurePoligono);
            }else{
                var point = new Point(transform(feature.geometry.coordinates[0], fromProjection, toProjection));
                var iconFeature = new Feature({
                    geometry: point,
                    name: feature['properties']['name'],
                    id:feature['properties']['id']
                });
                var iconStyle = new Style({
                    image: new Icon ({
                        src:  CameraIconGreen,
                        rotateWithView: true, 
                        anchorXUnits: "fraction",
                        anchorYUnits: 'fraction',
                        anchor: [0.5, 1], // Define o ponto de ancoragem do ícone (o ponto inferior central)
                    }),
                });        
                iconFeature.setStyle(iconStyle);
                console.log(iconFeature)
                areaLayer.getSource()!.addFeature(iconFeature);
            }
        })

        map.addLayer(areaLayer);
        areaLayer.setZIndex(10)
        return ()=> {
            if(map){
                map.removeLayer(areaLayer);
            }
        };
    },[map,polygons])

    return null;
}