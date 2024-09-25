from adapters.glpi.GLPI_group_manager import GLPIGroupManager
from adapters.glpi.GLPI_login_manager import GLPILoginManager
from adapters.glpi.GLPI_ticket_manager import GLPITicketManager
from adapters.glpi.GLPI_user_manager import GLPIUserManager
from adapters.glpi.GLPI_asset_manager import GLPIAssetManager
from core.ticket.group_manager import GroupManager
from core.ticket.login_manager import LoginManager
from core.ticket.ticket_manager import TicketManager
from core.ticket.user_manager import UserManager
from core.inventory.asset_manager import AssetManager
from typing import Final
from api_crud import create, delete, update, get

LOGIN_MANAGER: Final[LoginManager] = GLPILoginManager()
TICKET_MANAGER: Final[TicketManager] = GLPITicketManager()
USER_MANAGER: Final[UserManager] = GLPIUserManager()
GROUP_MANAGER: Final[GroupManager] = GLPIGroupManager()
ASSET_MANAGER: Final[AssetManager] = GLPIAssetManager()

#LOGIN ENDPOINTS
@create(LOGIN_MANAGER, LOGIN_MANAGER.login, '/Login')
def login() -> None:
    pass

@delete(LOGIN_MANAGER, LOGIN_MANAGER.logout, '/Logout')
def logout() -> None:
    pass

#TICKET ENDPOINTS
@get(TICKET_MANAGER, TICKET_MANAGER.get_all_ticket, '/Ticket')
def get_all_ticket() -> None:
    pass

@get(TICKET_MANAGER, TICKET_MANAGER.get_ticket_by_status, '/TicketByStatus/<string:status>')
def get_ticket_by_status() -> None:
    pass

@get(TICKET_MANAGER, TICKET_MANAGER.get_ticket_by_priority, '/TicketByPriority/<string:priority>')
def get_ticket_by_priority() -> None:
    pass

@get(TICKET_MANAGER, TICKET_MANAGER.get_ticket_by_id, '/TicketById/<string:id>')
def get_ticket_by_id() -> None:
    pass

@create(TICKET_MANAGER, TICKET_MANAGER.create_ticket, '/Ticket')
def create_ticket() -> None:
    pass

@create(TICKET_MANAGER, TICKET_MANAGER.create_ticket_from_sos_button, '/SOSButton')
def sos_button() -> None:
    pass

@update(TICKET_MANAGER, TICKET_MANAGER.update_status_ticket, '/TicketUpdateStatus/<string:id>')
def update_status_ticket() -> None:
    pass

@update(TICKET_MANAGER, TICKET_MANAGER.update_ticket_department, '/TicketUpdateDepartment/<string:id>')
def update_ticket_department() -> None:
    pass

@delete(TICKET_MANAGER, TICKET_MANAGER.delete_ticket, '/Ticket/<string:id>')
def delete_ticket() -> None:
    pass

@create(TICKET_MANAGER, TICKET_MANAGER.answer_ticket, '/TicketAnswer/<string:id>')
def answer_ticket() -> None:
    pass

@get(TICKET_MANAGER, TICKET_MANAGER.get_all_answers_ticket, '/TicketAnswer/<string:id>')
def get_all_answers_ticket() -> None:
    pass

@create(TICKET_MANAGER, TICKET_MANAGER.solution_ticket, '/TicketSolution/<string:id>')
def solution_ticket() -> None:
    pass

@get(TICKET_MANAGER, TICKET_MANAGER.get_all_solution_ticket, '/TicketSolution/<string:id>')
def get_all_solution_ticket() -> None:
    pass


# USER ENDPOINTS
@get(USER_MANAGER, USER_MANAGER.get_all_users, '/User')
def get_all_users() -> None:
    pass

@get(USER_MANAGER, USER_MANAGER.get_username_by_id,'/User/<string:id>')
def get_username_by_id() -> None:
    pass

@get(USER_MANAGER, USER_MANAGER.get_id_user_by_username, '/User/<string:user>')
def get_id_user_by_username() -> None:
    pass

@get(USER_MANAGER, USER_MANAGER.get_group_by_user_id, '/GroupByUserId/<string:id>')
def get_group_by_user_id() -> None:
    pass

@create(USER_MANAGER, USER_MANAGER.create_user, '/User')
def create_user() -> None:
    pass

@get(USER_MANAGER, USER_MANAGER.get_all_profiles, '/Profile')
def get_all_profiles() -> None:
    pass

@get(USER_MANAGER, USER_MANAGER.get_profile_by_id, '/ProfileByIdUser/<string:id>')
def get_profile_by_id() -> None:
    pass

@delete(USER_MANAGER, USER_MANAGER.delete_user_by_id, '/User/<string:id>')
def delete_user_by_id() -> None:
    pass


# GROUP ENDPOINTS
@get(GROUP_MANAGER, GROUP_MANAGER.get_all_groups, '/Groups')
def get_all_groups() -> None:
    pass


@get(GROUP_MANAGER, GROUP_MANAGER.get_all_users_by_groupid, '/UsersByGroupId/<string:id>')
def get_all_users_by_groupid() -> None:
    pass

#ASSET ENDPOINTS
@get(ASSET_MANAGER, ASSET_MANAGER.get_all_assets_by_itemtype, '/Assets/<string:item_type>')
def get_all_asset_by_itemtype() -> None:
    pass

@get(ASSET_MANAGER, ASSET_MANAGER.get_camera_by_name, '/Camera/<string:name>')
def get_camera_by_name() -> None:
    pass

@delete(ASSET_MANAGER, ASSET_MANAGER.delete_camera_by_id, '/Camera/<string:id>')
def delete_camera_by_id() -> None:
    pass

@create(ASSET_MANAGER, ASSET_MANAGER.create_camera, '/Camera')
def create_camera() -> None:
    pass

@update(ASSET_MANAGER, ASSET_MANAGER.update_camera_by_id, '/Camera/<string:id>')
def update_camera_by_id() -> None:
    pass



