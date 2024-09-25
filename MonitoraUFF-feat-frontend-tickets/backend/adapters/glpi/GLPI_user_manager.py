from typing import Any, Tuple
import requests
import hashlib
from flask import jsonify
from flask_api import status
import rest_api
from core.ticket.user_manager import UserManager
from adapters.glpi.HttpException import APIException
from singletons import ManagerSingleton
import os
import singletons
from dotenv import load_dotenv
load_dotenv()

class GLPIUserManager(ManagerSingleton, UserManager):
    def get_all_users(self, *args, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/User'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }
        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_all_users error {response.json()}")
        
    def get_username_by_id(self,*args, id:str, session_token=str, **kwargs: Any) -> Any:
        url = f'{singletons.glpi_url}/apirest.php/User/{id}'
        
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }
        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data["name"]
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_username_by_id error {response.json()}") 

    def get_id_user_by_username(self, *args, user=str, session_token=str, **kwargs: Any) -> Any:
        url = f'{singletons.glpi_url}/apirest.php/search/User?criteria[0][itemtype]=user&criteria[0][' \
              'field]=1&' \
              f'criteria[0][searchtype]=contains&criteria[0][value]={user}&forcedisplay[0]=2'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }
        response = requests.get(url, headers=headers, verify=False)
   
        if response.status_code == 200:
            json_data = response.json()
            return json_data['data'][0]
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_id_user_by_username error {response.json()}")
        
    def get_group_by_user_id(self, *args, id=str, session_token=str, **kwargs: Any) -> Any:
        url = f'{singletons.glpi_url}/apirest.php/User/{id}/Group_User'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }
        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_group_by_user_id error {response.json()}")

    def create_user(self, *args, name: str, password: str, email: str, profiles_id: int, department_id: int,
                    session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        json = {
            "input": {
                'name': name,
                'password': hashlib.sha1(password.encode()).hexdigest(),
                'email': email,
                'profiles_id': profiles_id,
                'is_active': 1
            }
        }

        url_user = f'{singletons.glpi_url}/apirest.php/User'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.post(url_user, headers=headers, json=json, verify=False)
        if response.status_code == 201:
            json_data = response.json()

            id = json_data['id']

            url = f'{singletons.glpi_url}/apirest.php/group/{department_id}/Group_User'

            json_group = {
                "input": {
                    "users_id": id,
                    "groups_id": department_id
                }
            }

            requests.post(url, headers=headers, verify=False, json=json_group)

            response_profiles = requests.get(url, headers=headers, verify=False)
            if response_profiles.status_code == 200:
                json_profiles = response_profiles.json()

                requests.delete(url + '/' + str(json_profiles[0]['id']), headers=headers)

            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: create_user error {response.json()}")

    def get_all_profiles(self, *args, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Profile'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_all_profiles error {response.json()}")

    def get_profile_by_id(self, *args, id: int, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/User/' + str(id) + '/Profile_User'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: get_profile_by_id error {response.json()}")

    def delete_user_by_id(self, *args, id: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/User/' + id + '?force_purge=true'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.delete(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"USER MANAGER: delete_user_by_id error {response.json()}")

