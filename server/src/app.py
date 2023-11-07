import os
import typing as t

from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_wtf.csrf import CSRFProtect, CSRFError

from . import csrf, views
from .db import database

csrf = CSRFProtect()

def loadConfig(app: Flask, config: t.Mapping[str, t.Any] | None) -> None:
    """
    Load the application config from the value passed in. Load
    default from config.py otherwise.

    Args:
        app (Flask) - the application instance
        config (Mapping[str, Any] | None) - the config mapping to load.
    """
    if config is not None:
        app.config.from_mapping(config)
    else:
        from .config import Config
        app.config.from_object(Config)

def setupDB(app: Flask):
    """
    Initialize the database from a URI constructed
    by config values.

    Args:
        app (Flask) - the application instance
    """
    dialect = app.config['DB_LANGUAGE']
    driver = app.config['DB_CONNECTOR']
    user = app.config['DB_USER']
    password = app.config['DB_PASSWORD']
    host = app.config['DB_HOST']
    port = app.config['DB_PORT']
    db = app.config['DB_SCHEMA']

    uri = f'{dialect}+{driver}://{user}:{password}@{host}:{port}/{db}'
    app.config['SQLALCHEMY_DATABASE_URI'] = uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    database.init(app)

def create_app(config=None):
    """
    Create the instance of the application server with the given config.

    Args:
        config (Mapping[str, Any] | None) - the configuration to load.
    """
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    loadConfig(app, config)

    # must be done after config is loaded -> use SECRET_KEY
    csrf.init_app(app)
    CORS(app)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    Session(app)                        # setup server-side session storage
    setupDB(app)                        # set up the database object
    app.register_blueprint(views.auth)  # register URL mappings

    return app

if (__name__ == '__main__'):
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)