from .adapter_uff import CameraAdapter
 


class ManufacturerTeki(CameraAdapter):
    def get_rtsp(self, nome_da_camera=str):
        """
        Retrieves the RTSP URL for a Teki camera.

        Args:
            nome_da_camera (str): The name of the camera.

        Returns:
            str: The RTSP URL for the Teki camera.

        Notes:
            This method uses the create_passwd method from the parent class to generate the password.
        """
        protocol = 'rtsp://{}@admin:{}'.format(
            nome_da_camera, self.create_passwd(nome_da_camera))
        return protocol
