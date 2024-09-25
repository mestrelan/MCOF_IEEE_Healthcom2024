from typing import Any, Tuple, Final
import requests
from flask import jsonify
from core.ticket.group_manager import GroupManager
from adapters.glpi.GLPI_user_manager import GLPIUserManager
import os
from adapters.glpi.HttpException import APIException
from core.ticket.user_manager import UserManager
from singletons import ManagerSingleton
from dotenv import load_dotenv
import singletons
load_dotenv()
import rest_api

class GLPIGroupManager(ManagerSingleton, GroupManager):
    def get_all_groups(self, *args, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Group'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"GROUP MANAGER: get_all_groups error {response.json()}")

    def get_all_users_by_groupid(self, *args, id=str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/group/{id}/Group_User'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"GROUP MANAGER: get_all_users_by_groupid {response.json()}")
        
    