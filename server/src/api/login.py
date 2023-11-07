import uuid

from flask import (flash, session, Request, Response)

from werkzeug.security import check_password_hash as checkHash

from ..db import database
from ..db.common_operations import getUserByName

def __redirectLogin(id: uuid) -> Response:
    session.clear()
    session['user_id'] = id
    return 'LOGIN SUCCESS' #redirect(url_for('index'))

def __verifyLogin(username: str, password: str) -> Response:
        db = database.get()
        record = getUserByName(db, username)
        passwdHash = str(record['password'], 'utf-8')

        if (checkHash(passwdHash, password)):
            return __redirectLogin(record['id'])
        else:
            raise Exception("Invalid Password.")
        
def onLogin(request: Request) -> Response:
    username = request.form['_username']
    password = request.form['_password']
    
    try:
        return __verifyLogin(username, password)
    except Exception as err:
        print(f'Failed login attempt. Username: {username}.\n', err)
        
    flash(message='Unauthorized.', category='error')
    return 'LOGIN FAILED' #render_template('auth/login.html')