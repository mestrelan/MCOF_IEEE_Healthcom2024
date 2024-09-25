import { SyntheticEvent, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { Link } from 'react-router-dom';
import { RegionHierarchy } from "../models/region";
import { findObjectRegionInHierarchy } from "../utils/FindObjectRegionInHierarchy";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface IRegionTreeView {
  hierarchyRegions: RegionHierarchy[];
}

/**
 * Cria Visualização em Árvore das Regiões
 *
 * @param hierarchyRegions - Array de objetos Hierárquicos de Região
 * @returns - Visualização em Árvore das Regiões Hierárquicas
 */

export const RegionTreeView: React.FC<IRegionTreeView> = ({
  hierarchyRegions,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (_event: SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const regionTreeSelected = findObjectRegionInHierarchy(
    hierarchyRegions,
    Number(selected),
  );

  const renderTree = (nodes: RegionHierarchy) => (
    <Link to={`/regiao/${nodes.id}`} key={nodes.id}>
      <Box>
        <TreeItem
          nodeId={nodes.id.toString()}
          label={nodes.name}
        >
          {Array.isArray(nodes.children)
            ? nodes.children.map((node: any) => renderTree(node))
            : null}
        </TreeItem>
      </Box>
    </Link>
  );
  

  return (
    <Box sx={{ width: theme.spacing(25) }}>
      <TreeView
        aria-label="Region Hierarchy"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1, maxWidth: "auto" }}
        expanded={expanded}
        selected={selected[0]}
        onNodeToggle={handleToggle}
        onNodeSelect={() => handleSelect}
      >
        {hierarchyRegions.map((rootNode: RegionHierarchy) =>
          renderTree(rootNode),
        )}
      </TreeView>
      {regionTreeSelected?.name}
    </Box>
  );
};