import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Select,
    MenuItem,
    Stack,
  } from "@mui/material";
  import  { useEffect, useState } from "react";
import { useSavePolygon } from "../hooks/useSavePolygon";

interface ModalAddFeatureToPolygonProps{
    open: boolean;
  coordinates: number[][];
  data: any;
  childs: any;
  typeFeature: any;
  onClose:()=>void;
}

export function ModalAddFeatureToPolygon({
    open,
    onClose,
    data,
    childs,
    coordinates,
    typeFeature
}:ModalAddFeatureToPolygonProps){


    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionData, setSelectedRegionData] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);
  
    useEffect(() => {
      const missingChildren = childs.filter((child: any) => {
        const isChildInsidePolygon = data.polygon.features.some(
          (feature: any) => {
            return feature.properties.id === child.id;
          },
        );
        return !isChildInsidePolygon;
      });
      const missingChildrenOptions = missingChildren.map((child: any) => (
        <MenuItem key={child.id} value={child.id}>
          {child.name}
        </MenuItem>
      ));
  
      setOptions(missingChildrenOptions);
    }, [data, childs]);
  
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      const selectedRegionId = event.target.value as string;
      setSelectedRegion(selectedRegionId);
      const selectedRegionData = childs.find(
        (child: any) => child.id === selectedRegionId,
      );
      setSelectedRegionData(selectedRegionData);
      console.log("data region", selectedRegionData);
    };
  
    const handleSave = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
        useSavePolygon(data, selectedRegionData, coordinates, typeFeature);
        window.location.reload()
        onClose();
    };
    
    const handleClose=()=>{
        onClose();
        window.location.reload()
    }

    return (
        <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Relacione Poligono a Região</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Preencha a option com a região que a feature adicionada pertence
        </DialogContentText>
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <label>
            Regiao que o poligono pertence:
            <Select
              name="region"
              value={selectedRegion}
              onChange={handleChange as any}
            >
              {options}
            </Select>
          </label>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Adicionar Região</Button>
      </DialogActions>
    </Dialog>
    );
}