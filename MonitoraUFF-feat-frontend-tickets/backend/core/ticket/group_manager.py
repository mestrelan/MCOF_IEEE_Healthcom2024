from abc import ABC, abstractmethod
from typing import Any, Tuple


class GroupManager(ABC):
    @abstractmethod
    def get_all_groups(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
    
    @abstractmethod
    def get_all_users_by_groupid(self, *args, id: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
