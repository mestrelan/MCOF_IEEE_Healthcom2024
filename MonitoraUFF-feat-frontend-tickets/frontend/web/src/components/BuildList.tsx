import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

export function BuildList({childs}:any){
    
    const [dataBuildPlan, setDataBuildPlan] = useState<null | any>();
    const navigate = useNavigate()

    useEffect(()=>{
        setDataBuildPlan(childs)
    },[childs])

    const handleItemClick = (itemId: number) => {
        console.log("Item ", itemId);
        navigate(`/regiao/${itemId}`);
      };

    return(
        <div>
        <div>Lista de Andares</div>
        <div>
          {dataBuildPlan &&
            dataBuildPlan.map((item: any) => (
              <Button key={item.id} onClick={() => handleItemClick(item.id)}>
                {item.name}
              </Button>
            ))}
        </div>
      </div>
    )
}