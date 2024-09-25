from typing import Final
from core.camera.Camera_manager import CameraManager
from api_crud import get, create, update, delete

CAMERA_MANAGER: Final[CameraManager] = CameraManager()

@get(CAMERA_MANAGER, CAMERA_MANAGER.get_protocol, '/CameraVideo/<string:nome_da_camera>')
def get_protocol() -> None:
    pass