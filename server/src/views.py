from http import HTTPStatus
from typing import Any

from flask import (abort, Blueprint, render_template, request)

from .api import login as login_handler, register as registration_handler

auth = Blueprint('auth', __name__, url_prefix='/auth')

def formView(request: request, get_response: Any, post_response: Any) -> Any:
    if (request.method == 'GET'):
        return get_response()
    elif (request.method == 'POST'):
        return post_response()
    else:
        return abort(HTTPStatus.METHOD_NOT_ALLOWED)
    
@auth.route('/login', methods=('GET', 'POST'))
def login():
    get = lambda: render_template('auth/login.html')
    post = lambda: login_handler.onLogin(request)
    return formView(request, get, post)
    
@auth.route('/register', methods=('GET', 'POST'))
def register():
    get = lambda: render_template('auth/register.html')
    post = lambda: registration_handler.onRegister(request)
    return formView(request, get, post)