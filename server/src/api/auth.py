import typing as t
import uuid

from flask import (flash, g, redirect, render_template, session, url_for, Request)
from werkzeug.security import check_password_hash as checkHash

from ..db.registration import Registration
from ..db import database
from ..db.common_operations import *

def __redirectLogin(id: uuid):
    session.clear()
    session['user_id'] = id
    return redirect(url_for('index'))

def onLogin(request: Request) -> t.Any:
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = database.get()
        record = getUserByName(db, username)
        if (checkHash(record['password'], password)):
            __redirectLogin(record[id])
        else:
            raise Exception("Invalid Password")
        
    except Exception as err:
        print(f"Failed login attempt. Username: {username}.\n", err)
        
    flash("Login Failed.")
    return render_template('auth/login.html')

def __validateRegistrationFilled(request: Request) -> str:
    error = None
    required_fields = [
        "_fname", "_lname", "_dob", 
        "_addr", "_addr_type", "_phone",
        "_phone_type", "_username", "_password"
    ]

    for entry in required_fields:
        if (request.form[entry] is None):
            error = "Missing required fields."
            break

    return error

def onRegister(request: Request) -> t.Any:
    error = __validateRegistrationFilled(request)
    if error is None:
        try:
            db = database.get()
            registration = Registration(request.form)
            insertCustomer(db, registration.customer_info)
            insertAddress(db, registration.customer_address)
            insertPhone(db, registration.customer_phone)
            insertUser(db, registration.user_info)

        except db.IntegrityError:
            error = f"User is already registered."
        else:
            return redirect(url_for("auth.login"))
        
    flash(error)
    return render_template('auth/register.html')