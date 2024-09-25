import importlib
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from config import Config
from sqlalchemy_utils import database_exists,create_database

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    """
    Initializes the database.

    This function initializes the database by creating tables for all the defined models.
    It uses the SQLAlchemy engine and the Base class to create the tables.
    """
    print("INITIALIZING DB")
    from .region_model import RegionModel
    if not database_exists(Config.SQLALCHEMY_DATABASE_URI):
        create_database(Config.SQLALCHEMY_DATABASE_URI)
    Base.metadata.create_all(bind=engine)