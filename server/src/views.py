from http import HTTPStatus
from typing import Any

from flask import (abort, Blueprint, jsonify, redirect, request, session, url_for)

from .api import login as login_handler, register as registration_handler
from .db import database
from .db.common_operations import getUserByID
from .config import BASE_DIR

from .db.common_operations import getAccountInfoByCustomerID

auth = Blueprint(
    'auth', __name__, 
    url_prefix='/auth',
    static_folder=BASE_DIR / 'client/build',
    static_url_path='static'
)

#adding blueprint fot account
account = Blueprint('account', __name__, url_prefix='/account')

def formView(request: request, get_response: Any, post_response: Any) -> Any:
    if (request.method == 'GET'):
        return get_response()
    elif (request.method == 'POST'):
        return post_response()
    else:
        return abort(HTTPStatus.METHOD_NOT_ALLOWED)
    
@auth.route('/login', methods=(['POST']))
def login():
    return login_handler.onLogin(request)
    
@auth.route('/register', methods=('GET', 'POST'))
def register():
    get = lambda: 'Register Page' #render_template('auth/register.html')
    post = lambda: registration_handler.onRegister(request)
    return formView(request, get, post)

@auth.route('/@me', methods=(['GET']))
def get_current_user():
    user_id = session.get('user_id')

    if (user_id is None):
        return redirect(url_for('auth.login'))

    db = database.get()
    record = getUserByID(db, user_id)

    return jsonify({
        'ID': user_id,
        'Username': record['user'],
        'First Name': record['first_name'],
        'Last Name': record['last_name'],
        'Date of Birth': record['date_of_birth'],
        'Primary Address': record['address'],
        'Phone Number': record['phone_number']
    })
    
#path for account    
@account.route('/account', methods=['GET'])
def get_account_info():
    user_id = session.get('user_id')

    if user_id is None:
        return redirect(url_for('auth.login'))

    db = database.get()
    account_info = getAccountInfoByCustomerID(db, user_id)

    return jsonify({
        'ID': account_info['ID'],
        'First Name': account_info['First Name'],
        'Last Name': account_info['Last Name'],
        'Date of Birth': account_info['Date of Birth'],
        'Account ID': account_info['account_id'],
        'Balance': account_info['balance'],
        'Account Type': account_info['account_type']
    })