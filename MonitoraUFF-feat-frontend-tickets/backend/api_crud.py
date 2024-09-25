import jwt
from flask import jsonify, request
from flask_api import status
from typing import Any, Callable, Tuple, TypeVar
from typing_extensions import ParamSpec
import functools
from adapters.glpi.HttpException import APIException
from singletons import app
from http import HTTPStatus

P = ParamSpec('P')
T = TypeVar('T')

def create(manager: Any, api_func: Callable[P, T], rule: str, **options: Any) -> Callable[P, T]:
    """ Factory decorator that associates a 'create' function from your API, passed via the 'api_func' argument, 
    with a REST endpoint defined by 'rule' and 'option' params."""
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        """ Decorator responsible for returning the wrapper. The wrapper, in turn, invokes the 'create'
        function passed via the 'api_func' argument, forwarding the arguments informed via 'args' and 'kwargs' 
        and the JSON data that follows the request."""
        @app.post(rule, **options)
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Tuple[Any, int]:
            """ Wrapper for the function passed via the 'api_func' argument in the decorator.
            Expected arguments must be given via JSON in 'request'"""
            """ TODO USe LOGIN_MANAGER to check permission to access `rule` """
            if not request.is_json:
                return {'error': 'Request must be JSON'}, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            try:
                params = request.get_json()
                if rule != "/Login":
                    try:
                        token = request.headers.get('Authorization')
                        payload = jwt.decode(token, "CHAVE_SECRETA", algorithms=['HS256'])
                        session_token = {"session_token": payload['session_token']}
                        return jsonify(api_func(manager, *args, **kwargs, **params, **session_token)), status.HTTP_200_OK
                    except jwt.ExpiredSignatureError as error:
                        code, message = translate_to_html_error(error)
                        return {'error': "Token "}, code
                    except jwt.InvalidTokenError as error:
                        code, message = translate_to_html_error(error)
                        return {'error': "Invalid Token"}, code
                else:
                    return jsonify(api_func(manager, *args, **kwargs, **params)), status.HTTP_200_OK
            except Exception as error:
                code, message = translate_to_html_error(error)
                return {'error': message}, code
        func.__doc__ = wrapper.__doc__
        return wrapper
    return decorator


def delete(manager: Any, api_func: Callable[P, T], rule: str, **options: Any) -> Callable[P, T]:
    """ Factory decorator that associates a 'deleter' function from your API, passed via the 'api_func' argument, 
    with a REST endpoint defined by 'rule' and 'option' params."""
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        """ Decorator responsible for returning the wrapper. The wrapper, in turn, invokes the 'deleter'
        function passed via the 'api_func' argument, forwarding the arguments informed via 'args' and 'kwargs' 
        and the JSON data that follows the request."""
        @app.delete(rule, **options)
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Tuple[Any, int]:
            """ Wrapper for the function passed via the 'api_func' argument in the decorator."""
            try:
                token = request.headers.get('Authorization')
                
                payload = jwt.decode(token, "CHAVE_SECRETA", algorithms=['HS256'])
                session_token = {"session_token": payload['session_token']}
                return jsonify(api_func(manager, *args, **kwargs, **session_token)), status.HTTP_200_OK
            except jwt.ExpiredSignatureError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Token "}, code
            except jwt.InvalidTokenError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Invalid Token"}, code
            except Exception as error:
                code, message = translate_to_html_error(error)
                return {'error': message}, code
        func.__doc__ = wrapper.__doc__
        return wrapper
    return decorator


def get(manager: Any, api_func: Callable[P, T], rule: str, **options: Any) -> Callable[P, T]:
    """ Factory decorator that associates a 'getter' function from your API, passed via the 'api_func' argument, 
    with a REST endpoint defined by 'rule' and 'option' params."""
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        """ Decorator responsible for returning the wrapper. The wrapper, in turn, invokes the 'getter'
        function passed via the 'api_func' argument, forwarding the arguments informed via 'args' and 'kwargs' 
        and the JSON data that follows the request."""
        @app.get(rule, **options)
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Tuple[Any, int]:
            """ Wrapper for the function passed via the 'api_func' argument in the decorator."""
            try:
                token = request.headers.get('Authorization')

                payload = jwt.decode(token, "CHAVE_SECRETA", algorithms=['HS256'])
                session_token = {"session_token": payload['session_token']}
                username = {"username": payload['username']}
                return jsonify(api_func(manager, *args, **kwargs, **session_token, **username)), status.HTTP_200_OK
            except jwt.ExpiredSignatureError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Token "}, code
            except jwt.InvalidTokenError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Invalid Token"}, code
            except Exception as error:
                code, message = translate_to_html_error(error)
                return {'error': message}, code
        func.__doc__ = wrapper.__doc__
        return wrapper
    return decorator


def translate_to_html_error(error: Exception) -> Tuple[int, str]:
    """ Converts the informed exception into HTML error code and textual message to be return by the request. """
    if isinstance(error, NotImplementedError):
        return status.HTTP_501_NOT_IMPLEMENTED, 'Method or function hasn''t been implemented yet.'
    if isinstance(error, APIException):
        return error.status_code, str(error)
    return status.HTTP_400_BAD_REQUEST, str(error)


def update(manager: Any, api_func: Callable[P, T], rule: str, **options: Any) -> Callable[P, T]:
    """ Factory decorator that associates an 'updater' function from your API, passed via the 'api_func' argument, 
    with a REST endpoint defined by 'rule' and 'option' params."""
    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        """ Decorator responsible for returning the wrapper. The wrapper, in turn, invokes the 'updater'
        function passed via the 'api_func' argument, forwarding the arguments informed via 'args' and 'kwargs' 
        and the JSON data that follows the request."""
        @app.put(rule, **options)
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Tuple[Any, int]:
            """ Wrapper for the function passed via the 'api_func' argument in the decorator.
            Expected arguments must be given via JSON in 'request'"""
            if not request.is_json:
                return {'error': 'Request must be JSON'}, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            try:
                token = request.headers.get('Authorization')

                payload = jwt.decode(token, "CHAVE_SECRETA", algorithms=['HS256'])
                session_token = {"session_token": payload['session_token']}
                

                params = request.get_json()
                return jsonify(api_func(manager, *args, **kwargs, **params, **session_token)), status.HTTP_204_NO_CONTENT
            except jwt.ExpiredSignatureError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Token "}, code
            except jwt.InvalidTokenError as error:
                code, message = translate_to_html_error(error)
                return {'error': "Invalid Token"}, code
            except Exception as error:
                code, message = translate_to_html_error(error)
                return {'error': message}, code
        func.__doc__ = wrapper.__doc__
        return wrapper
    return decorator