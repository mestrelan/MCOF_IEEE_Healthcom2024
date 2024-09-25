from abc import ABC, abstractmethod
from typing import Any, Dict, TypedDict

class Login(TypedDict):
    """ Dict that represents a login"""
    username: str
    password: str

class LoginManager(ABC):
    @abstractmethod
    def login(self, *args, username: str, password: str, **kwargs) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def logout(self, *args, **kwargs) -> Dict[str, Any]:
        raise NotImplementedError

