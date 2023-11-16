import json
from flask import jsonify, redirect, Request, session
from ..db import database
from ..db.common_operations import getAccountTransactions, doesUserIDMatchAccount

def __sortTransactionsByTime(record):
    return record['timestamp']
                  
def onRequestTransactionInfo(request: Request):
    user_id = session.get('user_id')

    if user_id is None:
        return redirect('/')

    account_id = json.loads(request.data)["id"]
    db = database.get()

    # check that the customer_id in the current session matches the account record
    if (doesUserIDMatchAccount(db, user_id, account_id) == False):
        print(f"Suspicious activity detected: user {user_id} \
              requesting account they do not own {account_id}")
        session.clear()
        return redirect('/')
    
    transactions = getAccountTransactions(db, account_id)
    response = []
    for record in transactions:
        response.append({
            'id': record['id'],
            'timestamp': record['timestamp'],
            'type': record['type'],
            'amount': record['amount']
        })

    response.sort(reverse=True, key=__sortTransactionsByTime)
    return jsonify(response)
