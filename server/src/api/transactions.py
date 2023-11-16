import json
from flask import jsonify, redirect, Request, session
from ..db import database
from ..db.common_operations import getAccountTransactions, doesUserOwnAccount

def onRequestTransactionInfo(request: Request):
    user_id = session.get('user_id')

    if user_id is None:
        return redirect('/')

    account_id = json.loads(request.data)["id"]
    db = database.get()

    # check that the customer_id in the current session matches the account record
    if (doesUserOwnAccount(db, user_id, account_id) == False):
        print(f"Suspicious activity detected: user {user_id} \
              requesting account they do not own {account_id}")
        session.clear()
        return redirect('/')
    
    transactions = getAccountTransactions(db, account_id)
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
