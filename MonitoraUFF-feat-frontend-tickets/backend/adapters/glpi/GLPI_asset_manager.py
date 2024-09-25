import rest_api
from typing import Any, Tuple, Final
import requests
from flask import jsonify
from core.inventory.asset_manager import AssetManager
import os
from adapters.glpi.HttpException import APIException
from singletons import ManagerSingleton
from dotenv import load_dotenv
import singletons
load_dotenv()


class GLPIAssetManager(ManagerSingleton, AssetManager):
    def get_all_assets_by_itemtype(self, *args, session_token=str, item_type=str, **kwargs: Any) -> Tuple[Any, Any]:
        if item_type == 'Camera':  
            url = f'{singletons.glpi_url}/apirest.php/PluginGenericobject{item_type}'
        else:
            url = f'{singletons.glpi_url}/apirest.php/{item_type}'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"ASSET MANAGER: get_all_assets_by_itemtype error {response.json()}")
        
    def get_manufacturer_by_id(self, *args, session_token=str,  id=int, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Manufacturer/'+str(id)

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"ASSET MANAGER: get_manufacturer_by_id error {response.json()}")
        
    def get_camera_by_id(self, *args, session_token=str, id=int, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/PluginGenericobjectCamera/{str(id)}'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"ASSET MANAGER: get_camera_by_id error {response.json()}")

    def get_camera_by_name(self, *args, session_token=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f"{singletons.glpi_url}/apirest.php/search/PluginGenericobjectCamera?criteria[0][itemtype]=PluginGenericobjectCamera&criteria[0][field]=1&" \
              "criteria[0][searchtype]=contains&criteria[0][value]="+name+"&forcedisplay[0]=2"

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
        }

        response = requests.get(url, headers=headers, verify=False)

        json_data = response.json()
        
        #The first request returns the camera id, but not the manufacturer name nor manufacturer_id. 
        # So, I need to make another request to get the manufacturer_id and after that another one to get the manufacturer_name.


        camera_id = json_data["data"][0]["2"]
        #This request returns more info about the camera, including the manufacturer_id.
        camera_info = self.get_camera_by_id(session_token=session_token, id=camera_id)

        manufacturers_id = camera_info["manufacturers_id"]
        #With the manufacturer_id we can get the manufacturer_name.
        manufacturer = self.get_manufacturer_by_id(session_token=session_token, id=manufacturers_id)

        if response.status_code == 200:
            json_data = response.json()
            #Adding the manufacturer_name to the json_data.
            json_data["data"][0]["manufacturer_name"] = manufacturer["name"]
            return json_data
        else:
            raise APIException(response.status_code,
                               f"ASSET MANAGER: get_camera by name error {response.json()}")

    def delete_camera_by_id(self, *args, session_token=str, id=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/PluginGenericobjectCamera/' + id + '?force_purge=true'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.delete(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"ASSET MANAGER: delete_camera_by_id error {response.json()}")

    def create_camera(self, *args, session_token=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        json = {
            "input": {
                "itemtype": "Camera",
                "name": name
            }
        }
        url = f'{singletons.glpi_url}/apirest.php/PluginGenericobjectCamera'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.post(url, headers=headers, verify=False, json=json)

        if response.status_code == 201:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"ASSET MANAGER: create_camera error {response.json()}")

    def update_camera_by_id(self, *args, session_token=str, id=str, name=str, **kwargs: Any) -> Tuple[Any, Any]:
        json = {
            "input": {
                "itemtype": "Camera",
                "name": name
            }
        }
        url = f'{singletons.glpi_url}/apirest.php/PluginGenericobjectCamera/' + id

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.put(url, headers=headers, verify=False, json=json)

        if response.status_code == 204:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code,
                               f"ASSET MANAGER: update_camera error {response.json()}")



