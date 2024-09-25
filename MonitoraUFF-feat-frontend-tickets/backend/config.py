from dotenv import load_dotenv
import os
load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


class Config:
    """
    Configuration class for your application.

    This class contains configuration options for your application. It defines settings such as whether the application is in debug mode, the database connection URI, and whether SQLAlchemy should track modifications.

    Attributes:
        DEBUG (bool): Indicates whether the application is in debug mode (default is False).
        SQLALCHEMY_DATABASE_URI (str): The database connection URI, including credentials and database name.
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): Indicates whether SQLAlchemy should track modifications (default is False).
    """

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = f"mysql://{DB_USER}:{DB_PASSWORD}@localhost/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
