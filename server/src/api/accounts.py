from flask import jsonify, redirect, Request, session, url_for
from ..db import database
from ..db.common_operations import getAccountsByCustomerID

def onRequestAccountInfo(request: Request):
    user_id = session.get('user_id')

    if user_id is None:
        return redirect('/')

    db = database.get()
    accounts = getAccountsByCustomerID(db, user_id)

    response = []
    for record in accounts:
        response.append({
            'id': record['id'],
            'name': record['type'] + " - (id: " + record['id'][:5] + "...)",
            'balance': record['balance']
        })
        
    return jsonify(response) 