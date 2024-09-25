import { Region,RegionHierarchy } from "../models/region";

/**
 * Cria Hierarquia das Regiões
 *
 * @param regions - Array de objetos Regiao
 * @returns - Array de objetos Região Hierárquico
 */

function hierarchyRegion(regions: Region[]) {
  const arrayRegionHierarchy: RegionHierarchy[] = regions.map((region) => ({
    id: region.id,
    name: region.name,
    upper_region: region.upper_region,
    // Create TreeLevel in array to get the level of node
  }));

  const regionDictionary: { [id: number]: RegionHierarchy } = {};

  // Cria um dicionário onde a chave é o ID da região
  arrayRegionHierarchy.forEach((_region) => {
    regionDictionary[_region.id] = {
      id: _region.id,
      name: _region.name,
      upper_region: _region.upper_region,
      children: [],
    };
  });

  // Adiciona regiões filhas aos nós corretos no dicionário
  arrayRegionHierarchy.forEach((_region) => {
    if (_region.upper_region !== null) {
      const parentRegion = regionDictionary[_region.upper_region];
      if (parentRegion) {
        if (!parentRegion.children) {
          parentRegion.children = [];
        }
        parentRegion.children.push(regionDictionary[_region.id]);
      }
    }
  });

  // Encontrar a raiz da árvore (região sem região superior)
  let rootRegion: RegionHierarchy | undefined;
  const arrayRootRegion: RegionHierarchy[] = [];
  arrayRegionHierarchy.forEach((_region) => {
    if (_region.upper_region === null) {
      rootRegion = regionDictionary[_region.id];
      arrayRootRegion.push(rootRegion);
    }
  });


  return arrayRootRegion;
}

export default hierarchyRegion;