import { Box, Drawer, useTheme,Button, TextField } from "@mui/material";
import { Region } from "../models/region"
import { LabelOptions } from "./LabelOptions";
import { useEffect, useState } from "react";

interface EditBarProps{
    regionData:Region,
    handleTypeFeature:any
    handleDeleteRegion:any
    handleUpdateRegion:any
}


export function EditBar({
    regionData,
    handleTypeFeature,
    handleDeleteRegion,
    handleUpdateRegion
}:EditBarProps){
    const theme = useTheme()
    const [regionDataState, setRegionDataState] = useState<Region>(regionData );
    const [extendValues, setExtendValues] = useState(["", "", "", ""]);
    const [typeRegionValue, setTypeRegionValue] = useState("EXTERNO");
    const [selectedType, setSelectedType] = useState("Polygon");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (regionData) {
            setRegionDataState(regionData);
        }
    }, [regionData]);

    // HANDLERS
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setRegionDataState((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleTypeRegionChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setTypeRegionValue(event.target.value);
        setRegionDataState((prevData: any) => ({
            ...prevData,
            type_region: event.target.value
        }));
    }

    const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e?.target?.result;
    
            setSelectedImage(base64Image as string);
    
            setRegionDataState((prevData: any) => ({
                ...prevData,
                image: base64Image
            }));
        };
    
        reader.readAsDataURL(file);
      };

    function handleDeleteAction(){
        handleDeleteRegion();
    }

    function handleSaveAction(){
        handleUpdateRegion(regionDataState)
    }

    const handleExtendChange = (index: number, value: string) => {
        const updatedExtend = [...regionDataState.extend];
        
        updatedExtend[index] = value;
    
        setRegionDataState((prevState) => ({
            ...prevState,
            extend: updatedExtend
        }));
    };

    const handleTypeFeatureChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
      ) => {
        setSelectedType(event.target.value);
        handleTypeFeature(event.target.value);
     };

    return(
        <Drawer variant="permanent" anchor="right">
          <Box
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignContent={"center"}
          >
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              gap={theme.spacing(2)}
              mt={theme.spacing(2)}
            >
              <Button variant="contained" onClick={handleSaveAction}>
                Salvar Alterações
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteAction}>
                Excluir Região
              </Button>
              <TextField
                label="Nome"
                name="name"
                value={regionDataState.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Sigla"
                name="acronym"
                value={regionDataState.acronym}
                onChange={handleInputChange}
              />
              <TextField
                label="Descrição"
                name="description"
                value={regionDataState.description}
                onChange={handleInputChange}
              />
              {regionDataState.extend.map((value, index) => (
                <TextField
                  key={index}
                  label={`Extend ${index + 1}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleExtendChange(index, e.target.value)}
                />
             ))}
             <input className="flex flex-col" type="file" onChange={handleImageUpload} />
             <label>
                Tipo:
                <select
                    name="type_region"
                    value={typeRegionValue}
                    onChange={handleTypeRegionChange}
                >
                    <option value="EXTERNO">Externo</option>
                    <option value="INTERNO">Interno</option>
                </select>
                </label>
              <Box>
                Adicionar Feature no Mapa <br />
                <select
                  id="type"
                  onChange={handleTypeFeatureChange}
                  value={selectedType}
                >
                  <option value="Point">Camera</option>
                  <option value="Polygon">Poligono</option>
                </select>
              </Box>
              ID_regiao_superior:
              <select
                name="upper_region"
                value={regionDataState.upper_region}
                onChange={() => handleInputChange}
              >
                <LabelOptions />
              </select>
            </Box>
          </Box>
        </Drawer>
    );
}