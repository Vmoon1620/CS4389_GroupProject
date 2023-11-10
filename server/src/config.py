import os
import redis

from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=BASE_DIR / 'server/.env')

# ***** IMPORTANT KEEP THESE VALUES SECRET IN ACTUAL DEPLOYMENT **** 
# --> create and store private values in .env
class Config(object):

    DEBUG = os.environ['DEBUG']             # Run server in debug or production             -> NEVER DEPLOY TO PRODUCTION WITH DEBUG = TRUE
    SECRET_KEY = os.environ['SECRET_KEY']   # Secret used by flask server internals         -> USE A SECURE RANDOM VALUE IN DEPLOYMENT

    DB_LANGUAGE = 'mysql'                   # what sql dialect to use
    DB_CONNECTOR = 'pymysql'                # what db connector is used for communication
    DB_SCHEMA = 'Bank'                      # schema or database name
    DB_USER = os.environ['DB_USER']         # what database user to login to                -> DO NOT USE ROOT ACCOUNT IN DEPLOYMENT
    DB_HOST = os.environ['DB_HOST']         # address of mysql server
    DB_PORT = os.environ['DB_PORT']         # what port the database is hosted on           -> USE NON-STANDARD PORT IN DEPLOYMENT
    DB_PASSWORD = os.environ['DB_PASSWORD'] # the mysql database password                   -> USE A SECURE PASSWORD IN DEPLOYMENT

    SESSION_TYPE = "redis"                  # redis configuration for server-side session storage
    SESSION_PERMANENT = False               # don't maintain sessions on server shutdown
    SESSION_USE_SIGNER = True               # require sessions to be signed with server key

    SESSION_URL = redis.from_url(os.environ['REDIS_URL'])   # where redis storage is hosted -> KEEP REDIS HOST SECRET