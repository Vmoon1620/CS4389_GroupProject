from flask import jsonify, redirect, Request, session, url_for
from ..db import database
from ..db.common_operations import getUserTransactions

def onRequestTransactionInfo(request: Request):
    user_id = session.get('user_id')

    if user_id is None:
        return redirect('/')

    db = database.get()
    transactions = getUserTransactions(db, user_id)

    response = []
    for record in transactions:
        response.append({
            'id': record['id'],
            'account_id': record['account_id'],
            'timestamp': record['timestamp'],
            #'type': record['type'],
            #did similar process for type from accounts.py
            'name': record['type'] + " - (id: " + record['id'][:5] + "...)",
            'amount': record['amount']
        })

    return jsonify(response)
