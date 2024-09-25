from typing import Any, Final, List, Dict,Optional 
from .region import NewRegion,  RegionManagerAbstract, DeletedRegion, UpdatedRegion
from .region_model import RegionModel,LevelHierarchyType,RegionType
from sqlalchemy import select, text, update
from .serializer import Serializer
import base64
from dataclasses import dataclass


@dataclass
class RegionData:
    name: str
    acronym: str
    description: str
    extend: Optional[str]
    type_region: RegionType
    level_type:LevelHierarchyType
    image: Optional[str]
    polygon: Optional[Any] 
    upper_region: Optional[int] 




class CustomRegionManager(RegionManagerAbstract):

    def __init__(self, db_session: Any) -> None:
        self.db_session: Final = db_session

    def create_region(self, *args, **kwargs: Any) -> NewRegion:
        """ 
        Handles the creation a new region as @class:RegionModel.

        Parameters:
            args: Additional arguments (not used in this method).
            kwargs: Additional keyword arguments that should match the parameters expected by the  @class:RegionModel's constructor.

        Returns:
            NewRegion: A dictionary containing information about the id of the newRegion and the boolean value about the sucess of the transaction
        """
        filtered_kwargs = {key: value for key, value in kwargs.items() if key in RegionData.__annotations__}
        filtered_kwargs['upper_region'] = None if filtered_kwargs.get('upper_region','') == "" else filtered_kwargs.get('upper_region')
        new_region = RegionModel(**filtered_kwargs)

        if new_region.image is not None:
            image_str = bytes(new_region.image, 'utf-8')
            new_region.image = image_str
        self.db_session.add(new_region)
        try:
            self.db_session.commit()
            return {"id": new_region.id, "success": True}
        except Exception as e:
            print("error", e)
            return {"success": False}

    def get_all_regions(self, *args, **kwargs: Any) -> List:
        """
        Handles the retrive a list of all regions from the database.

        Parameters:
            args: Additional arguments (not used in this method)
            kwargs: Additional keyword arguments (not used in this method).

        Returns:
            List[Dict[str, Any]]: A list of dictionaries, where each dictionary represents a region.
        """

        statement = text(
            "SELECT ID, NAME, UPPER_REGION FROM region")
        result = self.db_session.execute(statement).all()
        region_dicts = Serializer.serialize_all_regions(result)
        return region_dicts

    def get_root_regions(self, *args, **kwargs: Any) -> List:
        """
        Handles the retrive a list of all regions that have null on the foreign key and regions that fk apoints to the regions the fk is null from the database.

        Parameters:
            args: Additional arguments (not used in this method)
            kwargs: Additional keyword arguments (not used in this method).

        Returns:
            List[Dict[str, Any]]: A list of dictionaries, where each dictionary represents a region.
        """

        statement_root = select(RegionModel).filter(
            RegionModel.upper_region.is_(None))
        root = self.db_session.scalars(statement_root).all()

        statement_node = text(
            "SELECT ID, NAME, UPPER_REGION, EXTEND,TYPE_REGION,LEVEL_TYPE FROM region WHERE UPPER_REGION IN (SELECT ID FROM region WHERE UPPER_REGION IS NULL)")
        node = self.db_session.execute(statement_node).all()
    
        node_regions = Serializer.serialize_node_regions(node)
        root_regions = Serializer(RegionModel).serialize_list(root)

        regions = root_regions + node_regions
        return regions

    def get_root_region_by_id(self, *args, **kwargs: Any) -> List:
        """
        Handles the retrieve a list with the region from the database based on the provided ID and the regions that apoints to her.

        Parameters:
            args: Additional arguments (not used in this method).
            kwargs: Additional keyword arguments. Should contain the 'id' parameter to specify the ID of the region to retrieve.

        Returns:
            List[Dict[str, Any]]: A list of dictionaries, where each dictionary represents a region.
        """
        
        id = kwargs["id"]
        statement_region = select(RegionModel).filter(
            (RegionModel.id == id))
        region = self.db_session.scalars(statement_region).all()
        statement_node = text(
            "SELECT ID, NAME, UPPER_REGION, EXTEND,TYPE_REGION,LEVEL_TYPE FROM region WHERE UPPER_REGION = :id")
        node = self.db_session.execute(statement_node, {"id": id}).all()

        node_regions = Serializer.serialize_node_regions(node)
        id_region = Serializer(region).serialize_list(region)
        regions = id_region + node_regions
        
        return regions

    def get_region_by_id(self, *args, **kwargs: Any) -> Dict:
        """
        Handles the retrieve of  a specific region from the database based on the provided ID

        Parameters:
            args: Additional arguments (not used in this method).
            kwargs: Additional keyword arguments. Should contain the 'id' parameter to specify the ID of the region to retrieve.

        Returns:
            Dict[str, Any]: A dictionary, where the dictionary represents the specific region.
        """

        id = kwargs["id"]
        statement = select(RegionModel).where(RegionModel.id == id)
        result = self.db_session.scalar(statement)
        region_dict = Serializer(result).serialize()
        return region_dict


    def delete_region_by_id(self, *args, **kwargs: Any) -> DeletedRegion:
        """
        Handles the delete of a region from the database based on the provided region ID.

        Parameters:
            args: Additional arguments (not used in this method)
            kwargs: Additional keyword arguments. Should contain the 'id' parameter to specify the ID of the region to delete..

        Returns:
            DeletedRegion:A dictionary containing information about the id of the deletedRegion and the boolean value about the sucess of the transaction
        """

        id = kwargs['id']
        existing_region = self.db_session.query(
            RegionModel).filter(RegionModel.id == id).first()
        if existing_region:
            update_statement = update(RegionModel).where(
                RegionModel.upper_region == id).values(upper_region=None)
            self.db_session.execute(update_statement)
            statement = select(RegionModel).where(RegionModel.id == id)
            result = self.db_session.scalar(statement)
            self.db_session.delete(result)
            self.db_session.commit()
            return {"id": id, "success": True}
        else:
            return {"success": False}

    def update_region_by_id(self, *args, **kwargs: Any) -> UpdatedRegion:
        """
        Handles the update of a region in the database based on the provided data and region ID.

        Parameters:
            args: Additional arguments (not used in this method).
            kwargs: Additional keyword arguments that should include the 'id' parameter to specify the ID of the region to be updated and other fields to be modified.

        Returns:
            Dict[str, Any]: A dictionary representing the updated region.
        """
        
        id = kwargs.pop('id', None)
        filtered_kwargs = {key: value for key, value in kwargs.items() if key in RegionData.__annotations__}
        existing_region = self.db_session.query(
            RegionModel).filter(RegionModel.id == id).first()
        if existing_region:
            statement = update(RegionModel).where(
                RegionModel.id == id).values(filtered_kwargs)
            self.db_session.execute(statement)
            self.db_session.commit()
            return {"id": id, "success": True}
        else:
            return {"success": False}
