#main
import os
import threading
import webbrowser

from flask import render_template
from flask_cors import CORS
import endpoints.glpi_endpoints as glpi_endpoints #Do not remove, otherwise it won't find the endpoints. Seems unused, but it is. 
import endpoints.camera_endpoint as camera_endpoint #Do not remove, otherwise it won't find the endpoints. Seems unused, but it is. 
import endpoints.map_endpoints as map_endpoints
from singletons import app
from config import Config
from core.map.database import init_db, db_session

app.config.from_object(Config)

CORS(app)
""" ... """

@app.teardown_appcontext
def teardown_db(exception):
    """
    This function is registered as a teardown handler with Flask's `teardown_appcontext` decorator. 
    It is called when the application context is torn down and is typically used to clean up resources 
    or perform final actions before the context is destroyed
    :param exception: An exception that may have occurred during the application context.
    """
    db_session.remove()


if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(port=5000, debug=False)


