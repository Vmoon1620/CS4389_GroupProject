from typing import Any

from flask import (flash, Request)

from ..db.registration import Registration
from ..db import database
from ..db.common_operations import *

def __validateRegistrationFields(request: Request) -> str:
    error = None
    required_fields = [
        "_fname", "_lname", "_dob", 
        "_addr", "_addr_type", "_phone",
        "_phone_type", "_username", "_password"
    ]

    for entry in required_fields:
        if (request.form[entry] is None):
            error = f"Missing required field '{entry}'"
            break

    return error

def onRegister(request: Request) -> Any:
    error = __validateRegistrationFields(request)
    if error is None:
        try:
            db = database.get()
            registration = Registration(request.form)
            insertCustomer(db, registration.customer_info)
            insertAddress(db, registration.customer_address)
            insertPhone(db, registration.customer_phone)
            insertUser(db, registration.user_info)

        except db.IntegrityError:
            error = "User already exists."
        else:
            return "OK" #redirect(url_for("auth.login"))
        
    flash(message=error, category='error')
    return "BAD" #render_template('auth/register.html')