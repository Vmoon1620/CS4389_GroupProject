import os
import typing as t
from flask import Flask

from .db import database
from . import views

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
        from .dev_config import Config
        app.config.from_object(Config)

def setupDB(app: Flask):
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

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # set up the database object
    setupDB(app)

    # register URL mappings
    app.register_blueprint(views.auth)

    return app

if (__name__ == '__main__'):
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
    #app.run(debug=True, host='localhost', port=5000)