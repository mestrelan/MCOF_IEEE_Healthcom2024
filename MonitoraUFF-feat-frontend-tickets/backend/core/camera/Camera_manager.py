import requests
from adapters.uff.HttpException import APIException
from adapters.uff.Teki import ManufacturerTeki
from adapters.uff.Hikvision import ManufacturerHikvision
from adapters.uff.Intelbras import ManufacturerIntelbras


class CameraManager:
    def get_protocol(self, *args, nome_da_camera, **kwargs):
        """
        Retrieves the protocol for a given camera name using authentication.

        Args:
            nome_da_camera (str): The name of the camera.

        Returns:
            str: The camera protocol.

        Raises:
            APIException: If the manufacturer class for the given camera is not found.
        """
        # Authentication data
        data = {
            "username": "glpi",
            "password": "monitoraGlpi1144"
        }
        # Authentication request
        response = requests.post("http://127.0.0.1:5000/Login", json=data)
        print(f"Response: {response.json()['token']}")

        # Setting up headers for subsequent requests
        headers = {
            "Authorization": response.json()['token']
        }

        # Retrieving camera information
        camera = requests.get(
            f"http://127.0.0.1:5000/Camera/{nome_da_camera}", headers=headers)
        print("Camera object == ")
        print(f"{camera.json()}")
        camera_data = camera.json()['data'][0]
        manufacturer_name = camera_data.get('manufacturer_name', None)
        try:
            # Constructing manufacturer class name
            manufacturer_name = f"Manufacturer{manufacturer_name}"
            # Getting the manufacturer class dynamically
            manufacturer_class = globals()[manufacturer_name]
            manufacturer = manufacturer_class('teste')
            # Retrieving the camera protocol
            protocol = manufacturer.get_rtsp(nome_da_camera)
            return protocol
        except KeyError:
            # Handling the case when the manufacturer class is not found
            raise APIException(
                f"Class for Manufacturer {manufacturer_name} not found")
