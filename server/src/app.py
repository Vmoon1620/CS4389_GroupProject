import os
from typing import Any, Mapping

from flask import Flask, redirect, url_for, render_template
from flask_cors import CORS
from flask_session import Session
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask.wrappers import Response

from . import views
#registering account blueprint
from .views import account

from .db import database
from .config import BASE_DIR, Config

csrf = CSRFProtect()

def loadConfig(app: Flask, config: Mapping[str, Any] | None) -> None:
    """ 
    ---------------------------------------------------------------------------
    Load the application config from the value passed in. Load default from 
    config.py otherwise.

    Args:
        app (Flask) - the application instance
        config (Mapping[str, Any] | None) - the config mapping to load.
    ---------------------------------------------------------------------------
    """
    if config is not None:
        app.config.from_mapping(config)
    else:
        app.config.from_object(Config)

def setupDB(app: Flask):
    """
    ---------------------------------------------------------------------------
    Initialize the database from a URI constructed by config values.

    Args:
        app (Flask) - the application instance.
    ---------------------------------------------------------------------------
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

def registerRoutes(app: Flask) -> None:    
    """ 
    ---------------------------------------------------------------------------
    Register all routes and callbacks for the application.

    Args:
        app (Flask) - the application instance
    ---------------------------------------------------------------------------
    """
    # register a callback to append csrf token to valid requests
    @app.after_request
    def add_csrf_cookie(response: Response):
        response.set_cookie('csrftoken', generate_csrf(), secure=True)
        return response
    
    # register the base route to server main page
    @app.route('/')
    def index():
        return app.send_static_file("index.html") #redirect(url_for('auth.login'))

    app.register_blueprint(views.auth)  # register URL mappings for authentication
    
def initializeApp(app: Flask, config: Mapping[str, Any] | None) -> None:
    """ 
    ---------------------------------------------------------------------------
    Load the application config and initialize database, security features,
    settings and routes.

    Args:
        app (Flask) - the application instance
        config (Mapping[str, Any] | None) - the config mapping to load.
    ---------------------------------------------------------------------------
    """
    loadConfig(app, config)
    
    # must be done after config is loaded -> uses SECRET_KEY
    csrf.init_app(app)                  # setup csrf protection
    CORS(app)                           # set up cross origin whitelist -> not needed, REMOVE LATER
    Session(app)                        # setup server-side session storage
    setupDB(app)                        # set up the database object
    registerRoutes(app)                 # register urls
    
def create_app(config=None):
    """ 
    --------------------------------------------------------------------------
    Create the instance of the application server with the given config.

    Args:
        config (Mapping[str, Any] | None) - the configuration to load.
    --------------------------------------------------------------------------
    """
    # get the path the the React build files
    path = BASE_DIR / 'client/build/'

    # create and configure the app
    app = Flask(
        __name__, 
        instance_relative_config=True, 
        static_folder=path,
        static_url_path=''
    )

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    initializeApp(app, config)
    return app

if (__name__ == '__main__'):
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context='adhoc')
