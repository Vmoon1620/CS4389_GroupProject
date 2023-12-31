from http import HTTPStatus
from typing import Any

from flask import (abort, Blueprint, jsonify, redirect, request, Response, session, url_for)

from .api import (
    login as login_handler, 
    register as registration_handler,
    accounts as account_handler,
    transactions as transactions_handler
)

from .db import database
from .db.common_operations import getUserByID
from .config import BASE_DIR

api = Blueprint('api', __name__, url_prefix='/api')

def formView(request: request, get_response: Any, post_response: Any) -> Any:
    if (request.method == 'GET'):
        return get_response()
    elif (request.method == 'POST'):
        return post_response()
    else:
        return abort(HTTPStatus.METHOD_NOT_ALLOWED)
    
@api.route('/login', methods=(['POST']))
def login():
    return login_handler.onLogin(request)

@api.route('/logout', methods=(['POST']))
def logout():
    session.clear()
    return Response(status=HTTPStatus.OK)
    
@api.route('/register', methods=(['POST']))
def register():
    return registration_handler.onRegister(request)

@api.route('/@me', methods=(['POST']))
def get_current_user():
    user_id = session.get('user_id')

    if (user_id is None):
        return redirect(url_for('/'))

    db = database.get()
    record = getUserByID(db, user_id)

    return jsonify({
        'firstName': record['first_name'],
        'lastName': record['last_name'],
        'dob': record['date_of_birth'],
        'address': record['address'],
        'phoneNumber': record['phone_number']
    })
    
#path for account    
@api.route('/accounts', methods=['GET'])
def accounts():
    return account_handler.onRequestAccountInfo(request)

#path for transactions    
@api.route('/transactions', methods=['POST'])
def transactions():
    return transactions_handler.onRequestTransactionInfo(request)