import time
import requests
import base64
import os
import jwt
from adapters.glpi.HttpException import APIException
from core.ticket.login_manager import LoginManager
from singletons import ManagerSingleton
from dotenv import load_dotenv
load_dotenv()
import singletons

class GLPILoginManager(ManagerSingleton, LoginManager):
    def login(self, *args, username, password, token_google, **kwargs):

        id_token = token_google
        decoded_token = verificar_id_token(id_token)
        print(decoded_token)
        if decoded_token:
            print("ID Token verificado com sucesso:")
            print(decoded_token)
        else:
            print("Erro ao verificar o ID Token.")



        authorization = transformation_base64(username=username, password=password)
        session_token = get_session_token(authorization)

        
        payload = {
            'username': username,
            'session_token': session_token
        }
        secret_key = 'CHAVE_SECRETA'
        token = jwt.encode(payload, secret_key, algorithm='HS256')

        return {"token": token}


    def logout(self, *args, session_token=str, **kwargs):
        url = f'{singletons.glpi_url}/apirest.php/killSession'
        headers = {
            'App-Token': singletons.app_token,
            'Session-Token': session_token
        }
        response = requests.delete(url, headers=headers, verify=False)
        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            raise APIException(response.status_code, f"LOGIN MANAGER: logout error {response.json()}")


def get_session_token(authorization):
    url = f'{singletons.glpi_url}/apirest.php/initSession'
    headers = {
        'Authorization': "Basic " + authorization,
        'App-Token': singletons.app_token,
    }
    #O servidor "Marlin telecom" não tem certificado SSL. Por isso, precisei colocar verify=False na request. No entanto, usa HTTPS.
    #Além disso, precisa que, no Insomnia, eu desabilite a opção "validate certificate".
    
    #O localhost pelo Docker tem url HTTP, sem o HTTPS (http://localhost/apirest...). Também devo remover o verify=False na request.
    #OU SEJA, NA URL DA REQUEST NO CÓDIGO EU TAMBÉM PRECISO TIRAR O HTTPS E COLOCAR HTTP.
    response = requests.get(url, headers=headers, verify=False)
    if response.status_code == 200:
        json_data = response.json()
        return json_data['session_token']
    else:
        raise APIException(response.status_code, f"LOGIN MANAGER: get_session_token error {response.json()}")


def transformation_base64(username, password):
    texto_bytes = f"{username}:{password}".encode('utf-8')
    base64_bytes = base64.b64encode(texto_bytes)
    base64_string = base64_bytes.decode('utf-8')

    return base64_string


def verificar_id_token(id_token):
    url = f'https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={id_token}'
    response = requests.get(url)
    if response.status_code == 200:
        token_info = response.json()
        # Verifique se o token é válido
        if 'error' not in token_info:
            return token_info
    return None