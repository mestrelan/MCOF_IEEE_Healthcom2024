from abc import ABC, abstractmethod
from typing import Any, Dict, TypedDict, Tuple


class Ticket(TypedDict):
    """ Dict that represents a ticket"""
    name: str
    description: str
    priority: int
    department: int

class TicketUpdateStatus(TypedDict):
    """ Dict that represents the mandatory fields of a ticket status update operation """
    id: int
    status: int

class TicketUpdateDepartment(TypedDict):
    """ Dict that represents the mandatory fields of a ticket department update operation """
    id: int
    entities_id: int

class TicketUpdateAnswer(TypedDict):
    """ Dict that represents the mandatory fields of a ticket answer operation """
    id: int
    answer: str

class TicketUpdateSolution(TypedDict):
    """ Dict that represents the mandatory fields of a ticket solution operation """
    id: int
    solution: str

class NewTicket(TypedDict):
    """ Dict that represents the fields returned in a ticket creation operation """
    id: int
    success: bool

class TicketManager(ABC):

    @abstractmethod
    def get_all_ticket(self, *args, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_ticket_by_status(self, *args, status: str,  **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_ticket_by_priority(self, *args, priority: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_ticket_by_id(self, *args, id: str, **kwargs: Any) -> Tuple[Any, Any]:
        raise NotImplementedError

    @abstractmethod
    def create_ticket(self, *args, name: str, content: str, priority: int, department: int, **kwargs: Any) -> NewTicket:
        raise NotImplementedError

    @abstractmethod
    def create_ticket_from_sos_button(self, *args, description: str, **kwargs: Any) -> NewTicket:
        raise NotImplementedError

    @abstractmethod
    def update_status_ticket(self, *args, id: str, status: str, **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def update_ticket_department(self, *args, id: str, department: str, **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def delete_ticket(self, *args, id: str, **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def answer_ticket(self, *args, id: str, answer: str, **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_all_answers_ticket(self, *args, id: str,  **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def solution_ticket(self, *args, id: str, solution: str,  **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_all_solution_ticket(self, *args, id: str,  **kwargs: Any) -> Dict[str, Any]:
        raise NotImplementedError
