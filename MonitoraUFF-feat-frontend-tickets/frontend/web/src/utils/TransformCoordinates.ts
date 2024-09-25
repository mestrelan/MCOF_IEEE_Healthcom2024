import { transform } from "ol/proj";
import { fromProjection, toProjection } from "../models/constants";

export function transformPolygonsCoordinates(polygonPoints:number[]){
    var coordenadasLinha = [];
    for(var i =0;i<polygonPoints.length;i++){
        var ponto = polygonPoints[i];
        var coordenada = transform([ponto[0], ponto[1]], fromProjection, toProjection);
        coordenadasLinha.push(coordenada);     
    }
    coordenadasLinha.push(coordenadasLinha[0]);
    return coordenadasLinha;
}


export function transformCoordinates(polygonPoints:number[]){
    var coordenadasLinha = [];
    for(var i =0;i<polygonPoints.length;i++){
        var ponto = polygonPoints[i];
        var coordenada = transform([ponto[0], ponto[1]], toProjection,fromProjection);
        coordenadasLinha.push(coordenada);     
    }
    return coordenadasLinha;
}