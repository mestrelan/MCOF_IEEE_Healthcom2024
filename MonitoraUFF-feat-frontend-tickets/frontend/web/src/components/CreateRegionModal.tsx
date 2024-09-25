import { useState } from "react";
import { RegionAdd } from "../models/region";
import { useRegion } from "../hooks/useRegion";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Stack,
  } from "@mui/material";
import { LabelOptions } from "./LabelOptions";
import { createRegionZoom } from "../models/zoom";

interface CreateRegionModalProps{
    open:boolean;
    onClose:()=>void;
}

export function CreateRegionModal({open,onClose}:CreateRegionModalProps){

    const {createRegion} = useRegion()
    const handleClose = () => {
        onClose();
      };
    const [extendValues, setExtendValues] = useState(["", "", "", ""]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newRegion, setnewRegion] = useState<RegionAdd>({
      name: "",
      acronym: "",
      image: null,
      description: "",
      type_region: "EXTERNO",
      level_type: "CAMPUS",
      polygon: {
        type: "FeatureCollection",
        features: [],
      },
      extend: [...extendValues],
      upper_region: "",
    });

    const handleInputChange = (event: { target: { name: any; value: any } }) => {
        const { name, value } = event.target;
        setnewRegion((prevRegiao: any) => ({
          ...prevRegiao,
          [name]: value,
        }));
      };

    const handleExtendChange = (index: number, value: string) => {
        const newExtendValues = [...extendValues];
        newExtendValues[index] = value;
        setExtendValues(newExtendValues);
      };
    
      const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedImage(file);
      };
    
      const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (selectedImage) {
          const reader = new FileReader();
    
          reader.onload = (e) => {
            const base64Image = e?.target?.result;
    
            newRegion.image = base64Image as string;
            sendRequest();
          };
    
          reader.readAsDataURL(selectedImage);
        } else {
          sendRequest();
        }
      };
    
      const sendRequest = async () => {
        const extendedRegion = { ...newRegion, extend: extendValues };
        await createRegion(extendedRegion);
        setnewRegion({
          name: "",
          acronym: "",
          description: "",
          type_region: "EXTERNO",
          level_type: "CAMPUS",
          polygon: {
            type: "FeatureCollection",
            features: [],
          },
          image: null,
          extend: extendValues,
          upper_region: "",
        });
        setExtendValues(["", "", "", ""]);
        setSelectedImage(null);
      };

    return(
        <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Adicionar Região</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Preencha os campos abaixo para adicionar uma região no Mapa atual Mapa
          Atual = Nó Selecionado.
        </DialogContentText>
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <TextField
            label="Nome"
            type="text"
            name="name"
            value={newRegion.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Sigla"
            type="text"
            name="acronym"
            value={newRegion.acronym}
            onChange={handleInputChange}
          />
          <TextField
            label="Descrição"
            type="text"
            name="description"
            value={newRegion.description}
            onChange={handleInputChange}
          />
          <label>
            tipo da região:
            <select
              name="level_type"
              value={newRegion.level_type}
              onChange={handleInputChange}
            >
              {Object.values(createRegionZoom).map((region_level_type) => (
                <option key={region_level_type} value={region_level_type}>
                  {region_level_type}
                </option>
              ))}
            </select>
          </label>

          <label>
            tipo:
            <select
              name="type_region"
              value={newRegion.type_region}
              onChange={handleInputChange}
            >
              <option>EXTERNO</option>
              <option>INTERNO</option>
            </select>
          </label>
          {extendValues.map((value, index) => (
            <TextField
              key={index}
              label={`Valor ${index + 1}`}
              type="text"
              value={value}
              onChange={(e) => handleExtendChange(index, e.target.value)}
            />
          ))}
          <input type="file" onChange={handleImageUpload} />
          <label>
            ID_regiao_superior:
            <select
              name="upper_region"
              value={newRegion.upper_region}
              onChange={handleInputChange}
            >
              {LabelOptions()}
            </select>
          </label>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Adicionar Região</Button>
      </DialogActions>
    </Dialog>
    );
}