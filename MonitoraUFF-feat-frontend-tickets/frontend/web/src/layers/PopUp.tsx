import { useContext, useEffect, useState } from "react";
import Overlay from 'ol/Overlay';
import { Button, Popover } from 'antd';
import { MapContext } from "../map";
import { Link } from "react-router-dom";
import { Feature } from "ol";

interface PopUpProps{
    handleDeletePolygonFromRegion: (featureId: number) => Promise<void>;
    handleSeletedFeature: (feature: Feature<any>,polygonId:number) => void;
}

export function PopUp({handleDeletePolygonFromRegion,handleSeletedFeature}:PopUpProps) {
    const map = useContext(MapContext);
    const [popup, setPopup] = useState(null);
    const [visible, setVisible] = useState(false);
    const [features, setFeatures] = useState([]);
    const [popoverPosition, setPopoverPosition] = useState([0, 0]);

    function handleDelete(){
        handleDeletePolygonFromRegion(features[0].get("id"))
    }

    function handleEdit(){
        handleSeletedFeature(features[0],features[0].get("id"))
    }

    useEffect(() => {
        let overlay = null;
        if (map && !popup) {
            overlay = new Overlay({
                element: document.createElement('div'),
                stopEvent: false
            });
            setPopup(overlay);
            map.addOverlay(overlay);
        }

        return () => {
            if (map && popup) {
                map.removeOverlay(popup);
            }
        }
    }, [map, popup]);



    useEffect(() => {
        if (!map || !popup) return;

        const onClickFeatureOnMap = (evt) => {
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {
                popup.setPosition(evt.coordinate);
                setVisible(true);
                setFeatures([feature]);
                setPopoverPosition(evt.coordinate);
            } else {
                setVisible(false);
            }
        };

        const onPointerMoveOnMap = (evt) => {
            const pixel = map.getEventPixel(evt.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            map.getTarget()!.style!.cursor = hit ? 'pointer' : '';
        };

        const onMoveStartOnMap = () => {
            setVisible(false);
        };

        map.on('click', onClickFeatureOnMap);
        map.on('pointermove', onPointerMoveOnMap);
        map.on('movestart', onMoveStartOnMap);

        return () => {
            map.un('click', onClickFeatureOnMap);
            map.un('pointermove', onPointerMoveOnMap);
            map.un('movestart', onMoveStartOnMap);
        };
    }, [map, popup]);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <Popover
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: "black", border: 5 ,fontWeight:"bold"}}>Informações</div>
                    <Button className="close-button" onClick={handleClose}>X</Button>
                </div>
            }
            trigger="click"
            placement="top"
            content={features.length > 0 ? (
                <>
                    <div>Nome: {JSON.stringify(features[0].get("name"), null, '\t')}</div>
                    <div>Tipo: {JSON.stringify(features[0].get("type"), null, '\t')}</div>
                    <div style={{ marginTop: 10 }}>
                        <Button onClick={handleDelete} >Excluir</Button>
                        <Button onClick={handleEdit} style={{ marginLeft: 10 }}>Editar</Button>
                        <Link  to={`/regiao/${features[0].get("id")}`}><Button  style={{ marginLeft: 10 }}>Ver </Button></Link>
                    </div>
                </>
        ) : null}
            open={visible && features.length > 0}
            style={{ position: 'absolute', left: popoverPosition[0], top: popoverPosition[1] }}
        />
    );
}
