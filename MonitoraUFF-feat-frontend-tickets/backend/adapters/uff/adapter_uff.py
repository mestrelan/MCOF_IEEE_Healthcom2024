from core.camera.camera_indirection import CameraIndirection

class CameraAdapter(CameraIndirection):
    def __init__(self, nome):
        """
        Initializes a CameraAdapter instance.

        Args:
            nome (str): The name of the camera adapter.
        """
        self.nome = nome

    def create_passwd(self, nome_da_camera=str):
        """
        Creates a password based on the given camera name.

        Args:
            nome_da_camera (str): The name of the camera.

        Returns:
            str: The generated password.
        """
        def building(name):
            """
            Extracts a numerical value from the camera name.

            Args:
                name (str): The camera name.

            Returns:
                int: The numerical value extracted from the name.
            """
            if "bl" in name:
                aux = name.split("bl")
                letter = aux[1][0].upper()
                return ord(letter) - ord('A') + 1
            return 0

        def define_passwd(name):
            """
            Defines a password based on the camera name.

            Args:
                name (str): The camera name.

            Returns:
                str: The generated password.
            """
            BASE = "Monitora"
            c = 0
            for letter in name:
                if letter == '-':
                    c += 1
            password = BASE + str(building(name)) + str(c)
            return password

        # Creating the password based on the given camera name
        passwd = define_passwd(nome_da_camera)
        return passwd
