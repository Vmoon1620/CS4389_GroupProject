# ***** IMPORTANT KEEP THESE VALUES SECRET IN ACTUAL DEPLOYMENT **** 
# --> create and store actual config in /instance (ignored by repository)

class Config(object):

    SECRET_KEY = 'secret'       # USE A SECURE RANDOM VALUE IN DEPLOYMENT

    DB_LANGUAGE = 'mysql'       # what sql dialect to use
    DB_CONNECTOR = 'pymysql'     # what db connector is used for communication
    DB_HOST = 'localhost'       # address of mysql server
    DB_PORT = 3306              # USE NON-STANDARD PORT IN DEPLOYMENT
    DB_SCHEMA = 'Bank'          # schema or database name

    DB_USER = 'root'            # DO NOT USE ROOT ACCOUNT IN DEPLOYMENT
    DB_PASSWORD = 'password'    # USE A SECURE PASSWORD IN DEPLOYMENT