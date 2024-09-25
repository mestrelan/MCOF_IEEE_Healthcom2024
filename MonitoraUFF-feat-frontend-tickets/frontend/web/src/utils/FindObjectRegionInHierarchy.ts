import { RegionHierarchy } from "../models/region";

/**
 * Procura o objeto no Array de Regiões Hierárquicas
 *
 * @param hierarchyRegions - Array de objetos Hierárquicos de Região
 * @param numberSelected - ID do objeto Região
 * @returns - Objeto da Região com ID correspondente
 */

export function findObjectRegionInHierarchy(
  hierarchyRegions: RegionHierarchy[],
  numberSelected: number,
): RegionHierarchy | null {
  for (const node of hierarchyRegions) {
    if (node.id === numberSelected) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const result = findObjectRegionInHierarchy(node.children, numberSelected);
      if (result) {
        return result;
      }
    }
  }

  return null;
}