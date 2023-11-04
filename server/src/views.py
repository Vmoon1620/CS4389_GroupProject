from flask import (abort, Blueprint, render_template, request)
from .api import auth as authentication_handler
import typing as t

auth = Blueprint('auth', __name__, url_prefix='/auth')

def formView(request: request, get_response: t.Any, post_response: t.Any) -> t.Any:
    if (request.method == 'GET'):
        return get_response()
    elif (request.method == 'POST'):
        return post_response()
    else:
        return abort(405)
    
@auth.route('/login', methods=('GET', 'POST'))
def login():
    get = lambda: render_template('auth/login.html')
    post = lambda: authentication_handler.onLogin(request)
    return formView(request, get, post)
    
@auth.route('/register', methods=('GET', 'POST'))
def register():
    get = lambda: render_template('auth/register.html')
    post = lambda: authentication_handler.onRegister(request)
    return formView(request, get, post)
