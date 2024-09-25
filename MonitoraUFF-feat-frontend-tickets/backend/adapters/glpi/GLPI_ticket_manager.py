import os
from typing import Any, Tuple
import requests
from flask import jsonify
import rest_api
from core.ticket.ticket_manager import TicketManager
from adapters.glpi.HttpException import APIException
from adapters.glpi.GLPI_user_manager import GLPIUserManager
from singletons import ManagerSingleton
from dotenv import load_dotenv
import singletons
load_dotenv()


have_new_ticket = False
have_new_update = False

class GLPITicketManager(ManagerSingleton, TicketManager):
    def get_all_ticket(self, *args, session_token: str, username: str, **kwargs) -> Tuple[Any, Any]:
        """
        Get all tickets from GLPI. 
        Note: 
        1. status_id map: 
            {1: "new", 2: "processing (assigned)", 3: "processing (planned)", 4: "pending", 5: "solved", 6: "closed"}

        2. id_priority map: 
            {1: "very low", 2: "low", 3: "medium", 4: "high", 5: "very high", 6: "major"}
        """

        # Get id by username
        users = GLPIUserManager()
        data = users.get_id_user_by_username(user=username, session_token=session_token)
        id = data["2"]

        # Get id Group by id user
        group_data = users.get_group_by_user_id(id=id, session_token=session_token)
        group_id = group_data[0]["groups_id"]

        url = f'{singletons.glpi_url}/apirest.php/search/Ticket?criteria[0][field]=8&criteria[0][searchtype]=equals&criteria[0][value]={group_id}'

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            json_data = response.json()


            # Mapping numeric keys to string keys

            keys_map = {
                "1": "name",
                "2": "id_ticket",
                "3": "id_priority",
                "4": "id_requester",
                "5": "id_assigned_to",
                "7": "category",
                "12": "status_id",
                "15": "date_creation",
                "19": "date_mod",
                "80": "entity",
                # "18": AINDA NÃO DESCOBRIMOS O QUE É ESEE CAMPO. NÃO É UTILIZADO.
            }
            # https://marlin.telecom.uff.br:44443
            # Updating response ticket keys
            transfomerd_data = []
            for ticket in json_data["data"]:
                transformed_ticket = {keys_map.get(key, key): value for key, value in ticket.items()}
                print(transformed_ticket)
                transfomerd_data.append(transformed_ticket)

            # Update the original "data" ticket array with the transformed data array.
            json_data["data"] = transfomerd_data

            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_all_ticket error {response.json()}")

    def get_ticket_by_status(self, *args, username: str, status: str, session_token: str, **kwargs) -> Tuple[Any, Any]:
        # Get id by username
        users = GLPIUserManager()
        data = users.get_id_user_by_username(user=username, session_token=session_token)
        id = data["2"]

        # Get id Group by id user
        group_data = users.get_group_by_user_id(id=id, session_token=session_token)
        group_id = group_data[0]["groups_id"]

        url = f"{singletons.glpi_url}/apirest.php/search/Ticket?" \
              f"criteria[0][field]=8&criteria[0][searchtype]=equals&criteria[0][value]={group_id}" \
              "&criteria[1][link]=AND&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=" + status

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_ticket_by_status error {response.json()}")

    def get_ticket_by_priority(self, *args, priority: str, username: str,session_token: str, **kwargs: Any) -> Tuple[Any, Any]:
        # Get id by username
        users = GLPIUserManager()
        data = users.get_id_user_by_username(user=username, session_token=session_token)
        id = data["2"]

        # Get id Group by id user
        group_data = users.get_group_by_user_id(id=id, session_token=session_token)
        group_id = group_data[0]["groups_id"]

        url = f"{singletons.glpi_url}/apirest.php/search/Ticket?" \
              f"criteria[0][field]=8&criteria[0][searchtype]=equals&criteria[0][value]={group_id}" \
              "&criteria[1][link]=AND&criteria[1][field]=3&criteria[1][searchtype]=equals&criteria[1][value]=" + priority

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_ticket_by_priority error {response.json()}")

    def get_ticket_by_id(self, *args, id: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_ticket_by_id error {response.json()}")

    def create_ticket(self, *args, name: str, content: str, priority: int, department: int, session_token=str,
                      **kwargs: Any) -> Tuple[Any, Any]:

        if (name == '' or content == '' or priority == '' or department == ''):
            raise APIException(404, f"TICKET MANAGER: create_ticket error ")


        json = {
            "input": {
                'name': name,
                'content': content,
                'priority': priority,
                'status': 1,
                '_groups_id_assign': department,
            }
        }

        print(json)

        url = f'{singletons.glpi_url}/apirest.php/Ticket'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.post(url, headers=headers, verify=False, json=json)

        if response.status_code == 201:
            global have_new_ticket
            have_new_ticket = True
            json_data = response.json()
            return json_data
        else:
            print(response.json())
            raise APIException(response.status_code, f"TICKET MANAGER: create_ticket error {response.json()}")

    def create_ticket_from_sos_button(self, *args, description: str, session_token=str, **kwargs: Any) \
            -> Tuple[Any, Any]:
        json = {
            "input": {
                'name': "BotaoSOS",
                'content': description,
                'priority': 6,
                'status': 1,
                '_groups_id_assign': 4,
            }
        }

        url = f'{singletons.glpi_url}/apirest.php/Ticket'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
            #'x-frame-options': 'SAMEORIGIN'
        }
        response = requests.post(url, headers=headers, json=json, verify=False)
        if response.status_code == 201:
            global have_new_ticket
            have_new_ticket = True
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: create_ticket_from_sos_button error {response.json()}")

    def update_status_ticket(self, *args, id: str, status: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:

        json = {
            "input": {
                "status": status
            }
        }

        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.put(url, headers=headers, verify=False, json=json)
        if response.status_code == 200:
            json_data = response.json()
            global have_new_update
            have_new_update = True
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: update_status_ticket error {response.json()}")

    def update_ticket_department(self, *args, id: str, department: str, session_token=str, **kwargs: Any)\
            -> Tuple[Any, Any]:
        if (department == ''):
            raise APIException(404, f"TICKET MANAGER: update_department error ")
        json = {
            "input": {
                "_groups_id_assign": department
            }
        }

        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.put(url, headers=headers, verify=False, json=json)

        if response.status_code == 200:
            json_data = response.json()
            global have_new_update
            have_new_update = True
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: update_ticket_department error {response.json()}")

    def delete_ticket(self, *args, id: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
        }

        response = requests.delete(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            global have_new_update
            have_new_update = True
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: delete_ticket error {response.json()}")

    def answer_ticket(self, *args, id: str, answer: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        
        """
        User JSON request must be:
        {
            "answer": answer
        }
        """

        json = {
            "input": {
                "itemtype": "Ticket",
                "items_id": int(id),
                "content": answer
            }
        }
        

        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id + '/TicketFollowup'
        
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, verify=False, json=json)
        
        if response.status_code == 201:
            json_data = response.json()
            global have_new_update
            have_new_update = True
            return json_data
        else:
            
            raise APIException(response.status_code, f"TICKET MANAGER: answer_ticket error {response.json()}")

    def get_all_answers_ticket(self, *args, id: str, session_token=str, **kwargs: Any) -> Any:
        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id + "/TicketFollowup"

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)
        json_data = response.json()

        if response.status_code == 200:
            #Commented due to lack of information returned; this snippet returns less info than needed.
            #resposta = []
            #for item in json_data:
            #    if item['content'] != "Solução aprovada":
            #        content = {
            #            "content": item['content']
            #        }
            #        resposta.append(content)
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_all_answers_ticket error {response.json()}")

    def solution_ticket(self, *args, id: str, solution: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        json = {
            "input": {
                "itemtype": "Ticket",
                "items_id": int(id),
                "content": solution,
                "solutiontypes_id": 2,
            }
        }
        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id + '/ITILSolution'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.post(url, headers=headers, verify=False, json=json)
        if response.status_code == 201:
            json_data = response.json()
            global have_new_update
            have_new_update = True
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: solution_ticket error {response.json()}")

    def get_all_solution_ticket(self, *args, id: str, session_token=str, **kwargs: Any) -> Tuple[Any, Any]:
        url = f'{singletons.glpi_url}/apirest.php/Ticket/' + id + "/ITILSolution"

        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"TICKET MANAGER: get_all_solution_ticket error {response.json()}")
