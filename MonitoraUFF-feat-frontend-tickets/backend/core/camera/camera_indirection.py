from abc import ABC, abstractmethod

class CameraIndirection(ABC):
    @abstractmethod
    def get_rtsp(self, nome_da_camera=str):
        """
        Abstract method to retrieve the RTSP URL for a given camera name.

        Args:
            nome_da_camera (str): The name of the camera.

        Raises:
            NotImplementedError: This method must be implemented by subclasses.
        """
        raise NotImplementedError

    @abstractmethod
    def create_passwd(self):
        """
        Abstract method to create a password.

        Raises:
            NotImplementedError: This method must be implemented by subclasses.
        """
        raise NotImplementedError
