from flask import Flask

glpi_url = ''
app_token = ''
contador = 0
class FlaskSingleton:
    """Made up class that handles the singularity of a Flask app instance, implementing the Singleton pattern in it"""
    instance = None
    def __init__(self):
        """Constructor: If a Flask app instance doesn't exist, it will create one. If it does, the constructor raises an exception"""

        if FlaskSingleton.instance != None:
            raise Exception("This class is a singleton.")

        else:
            FlaskSingleton.instance = Flask(__name__)


    @staticmethod
    def get_instance():
        """Flask app instance 'getter' function. Basically, it returns the instance if it already exists. If it doesn't,
        the function calls the class constructor to create one."""
        if FlaskSingleton.instance == None:
            FlaskSingleton()
        if str(FlaskSingleton.instance) == '<Flask \'singletons\'>':
            import tkinter as tk

            root = tk.Tk()
            root.geometry("300x200")
            root.title("GLPI setup")

            def get_url():
                global glpi_url
                global app_token
                glpi_url += url_inputbox.get()
                app_token = app_token_inputbox.get()
                root.destroy()

            tk.Label(root, text="Endereço do servidor GLPI:").pack()
            url_inputbox = tk.Entry(root)
            url_inputbox.pack()

            tk.Label(root, text="APP TOKEN:").pack()
            app_token_inputbox = tk.Entry(root)
            app_token_inputbox.pack()

            botao = tk.Button(root, text="OK", command=get_url)
            botao.pack()

            root.mainloop()
        return FlaskSingleton.instance


app = FlaskSingleton.get_instance()


"""Flask object that represents the app."""

class ManagerSingleton:
    """Generic Singleton handler class that serves all the ticket system manager classes. 
    When inherited by a manager class, it will be responsible for controlling the singularity
    of an instance of this manager class."""
    _instances = {}
    def __new__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__new__(cls)
            cls._instances[cls] = instance
        return cls._instances[cls]