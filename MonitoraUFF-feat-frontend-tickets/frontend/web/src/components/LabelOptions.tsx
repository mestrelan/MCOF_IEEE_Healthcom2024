import { useEffect, useState } from "react";
import { apiRegion } from "../services/region";

/**
 * Cria opções ao selecionar nó
 *
 *
 * @returns Retorna as opções vinculando nome e id
 *
 */

export const LabelOptions = () => {
  const { getAllRegions } = apiRegion();
  const [allRegionsNameId, setAllRegionsNameId] = useState<{
    [key: string]: any;
  }>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getAllRegions();
        const regionsObject: { [key: string]: any } = {};

        response.data.forEach((region: { name: string | number; id: any }) => {
          regionsObject[region.name] = region.id;
        });

        setAllRegionsNameId(regionsObject);
      } catch (error) {
        console.error("Erro ao buscar regiões:", error);
      }
    };

    fetchRegions();
  }, []);

  function LabelOptions() {
    const options = [
      <option value={""} key={""}>
        {" "}
      </option>,
    ];
    for (const [name, id] of Object.entries(allRegionsNameId)) {
      options.push(
        <option key={name} value={id}>
          {name}
        </option>,
      );
    }

    return options;
  }

  return LabelOptions();
};