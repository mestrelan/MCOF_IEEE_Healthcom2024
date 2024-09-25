from core.map.region import RegionManagerAbstract
from core.map.region_manager import CustomRegionManager
from core.map.database import db_session
from typing import Final
from api_crud import create, delete, update, get


REGION_MANAGER: Final[RegionManagerAbstract] = CustomRegionManager(db_session)


@create(REGION_MANAGER, REGION_MANAGER.create_region, '/api/region')
def create_region() -> None:
    pass


@get(REGION_MANAGER, REGION_MANAGER.get_root_regions, '/api/region')
def get_root_regions() -> None:
    pass


@get(REGION_MANAGER, REGION_MANAGER.get_all_regions, '/api/regions')
def get_all_regions() -> None:
    pass


@get(REGION_MANAGER, REGION_MANAGER.get_root_region_by_id, '/api/region/<string:id>')
def get_root_region_by_id() -> None:
    pass

@get(REGION_MANAGER, REGION_MANAGER.get_region_by_id, '/api/regions/<string:id>')
def get_region_by_id() -> None:
    pass


@delete(REGION_MANAGER, REGION_MANAGER.delete_region_by_id, '/api/region/<string:id>')
def delete_region_by_id() -> None:
    pass


@update(REGION_MANAGER, REGION_MANAGER.update_region_by_id, '/api/region/<string:id>')
def update_region_by_id() -> None:
    pass
