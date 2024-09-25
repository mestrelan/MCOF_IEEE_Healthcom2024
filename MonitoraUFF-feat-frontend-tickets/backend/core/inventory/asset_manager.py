from abc import ABC, abstractmethod
from typing import Any, Tuple


class AssetManager(ABC):
    @abstractmethod
    def get_all_assets_by_itemtype(self, *args, session_token=str, item_type=str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_camera_by_name(self, *args, session_token=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def delete_camera_by_id(self, *args, session_token=str, id=str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def create_camera(self, *args, session_token=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def update_camera_by_id(self, *args, session_token=str, id=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
