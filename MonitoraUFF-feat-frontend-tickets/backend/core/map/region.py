from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional, TypedDict
from enum import Enum

Extend = Tuple[float, float, float, float]
"""A collection of four values representing an array of 4 numbers that define the geographic extent of the map in the EPSG:4326 projection.
x = longitude, y = latitude [minX, minY, maxX, maxY]"""

Polygon = Dict[str, Any]
"""
Data structure that contains information about the map polygon.

Example:
    {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": []
        }
    }

Attributes:
    - type (str): A string indicating the type of the polygon. Common values include 'Feature'.
    - geometry (dict): A dictionary that describes the polygon's geometry, which includes type and coordinates.
"""


class RegionType(Enum):
    """
    Enumeration that represents the types of regions for a region creation operation.

    The `RegionType` enumeration defines two possible values: `EXTERNAL` and `INTERNAL`, which indicate
    whether a region is external or internal, respectively.
    """
    EXTERNAL = "EXTERNO"
    INTERNAL = "INTERNO"

class LevelHierarchyType(Enum):
    """
    Enumeration that represents the types of zooms for a region creation operation.

    The `LevelHierarchyType` enumeration defines five possible values: `COUNTRY`,`STATE`,`CITY`,`CAMPUS` and `BUILD`, which indicate the zoom of the region.
    """
    COUNTRY = "PAIS"
    STATE = "ESTADO"
    CITY = "CIDADE"
    CAMPUS = "CAMPUS"
    BUILD = "PREDIO"

class NewRegion(TypedDict):
    """ Dict that represents the fields returned in a region creation operation """
    id: int
    success: bool

class UpdatedRegion(TypedDict):
    """ Dict that represents the fields returned in a region update operation """
    id: int
    success: bool

class DeletedRegion(TypedDict):
    """ Dict that represents the fields returned in a region delete operation """
    id: int
    success: bool

class RegionManagerAbstract(ABC):

    @abstractmethod
    def create_region(self, *args, name: str, acronym: str, description: str, extend: Extend, type_region: RegionType, image: str, polygon: Polygon,level_type:LevelHierarchyType,upper_region: Optional[int], **kwargs: Any) -> NewRegion:
        raise NotImplementedError

    @abstractmethod
    def get_root_regions(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_all_regions(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_root_region_by_id(self, *args, id: str, **kwargs: Any) ->Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_region_by_id(self, *args, id: str, **kwargs: Any) ->Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def delete_region_by_id(self, *args, id: str, **kwargs: Any) -> DeletedRegion:
        raise NotImplementedError

    @abstractmethod
    def update_region_by_id(self, *args, id: str, **kwargs: Any) -> UpdatedRegion:
        raise
