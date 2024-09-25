from abc import ABC, abstractmethod
from typing import Any, TypedDict, Tuple


class User (TypedDict):
    """ Dicionario que representa um user"""
    name: str
    password: str
    email: str
    profiles_id: int
    entities_id: int
    is_active: int
    is_recursive: int
    is_dynamic: int
    is_default_profile: int

class UserManager(ABC):
    @abstractmethod
    def get_all_users(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
    
    @abstractmethod
    def get_id_user_by_username(self, *args, user: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_group_by_user_id(self, *args, id: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def create_user(self, *args, name: str, password: str, email: str, profiles_id: int, department_id: int,
                    **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
    
    @abstractmethod
    def get_all_profiles(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_profile_by_id(self, *args, id: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
    
    @abstractmethod
    def delete_user_by_id(self, *args, id: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError
