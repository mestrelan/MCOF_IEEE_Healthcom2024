from sqlalchemy import String, JSON, ForeignKey, Enum,LargeBinary,Text
from .database import Base
from sqlalchemy.orm import Mapped, mapped_column


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

class RegionModel(Base):
    """
    Model class representing a region in the database.

    This model class represents a region entity in the database. It defines the structure of the 'region' table and its associated columns.

    Attributes:
        __tablename__ (str): The name of the database table.
        id (int): The primary key of the region.
        name (str): The name of the region (255 characters, not nullable).
        acronym (str): The acronym of the region (255 characters, not nullable).
        description (str): The description of the region (255 characters, not nullable).
        extend (str): A collection of four values representing an array of 4 numbers that define the geographic extent of the map in the EPSG:4326 projection.
        x = longitude, y = latitude [minX, minY, maxX, maxY]
        type_region (RegionType): The type of the region, using the `RegionType` enum (default is `EXTERNAL`).
        level_type (LevelHierarchyType): The zoom of the region, using the `LevelHierarchyType` enum (default is `CAMPUS`)
        image (str): The image associated with the region
        polygon (str): The polygon data associated with the region in JSON format (nullable).
        upper_region (int): The ID of the upper region to which this region belongs (nullable).
    """
    __tablename__ = 'region'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False,)
    acronym: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    extend: Mapped[str] = mapped_column(JSON, nullable=True)
    type_region: Mapped[Enum] = mapped_column(Enum(
        RegionType.EXTERNAL,
        RegionType.INTERNAL,
        default=RegionType.EXTERNAL)
    )
    level_type:Mapped[Enum] = mapped_column(Enum(
        LevelHierarchyType.COUNTRY,
        LevelHierarchyType.STATE,
        LevelHierarchyType.CITY,
        LevelHierarchyType.CAMPUS,
        LevelHierarchyType.BUILD,
        default=LevelHierarchyType.CAMPUS
    ))
    image: Mapped[str] = mapped_column(Text(length=(2**32 - 1)) ,nullable=True)
    polygon: Mapped[str] = mapped_column(JSON, nullable=True)
    upper_region: Mapped[int] = mapped_column(
        ForeignKey('region.id'), nullable=True)
