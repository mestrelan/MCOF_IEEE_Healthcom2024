export enum StatusId {
    "Novo" = 1,
    "Em atendimento (Atribuído)" = 2,
    "Em atendimento (Planejado)" = 3,
    "Pendente" = 4,
    "Resolvido" = 5,
    "Fechado" = 6,
  }
  
  export enum IdPriority {
    "Muito Baixo" = 1,
    "Baixo" = 2,
    "Medio" = 3,
    "Alto" = 4,
    "Muito Alto" = 5,
    "Critica" = 6,
  }

export const fromProjection = 'EPSG:4326'; // Coordenadas geográficas
export const toProjection = 'EPSG:3857'; // Coordenadas de tela (Mercator)