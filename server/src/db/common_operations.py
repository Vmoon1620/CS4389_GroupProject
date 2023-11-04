import typing as t
from sqlalchemy import text, Row
from flask_sqlalchemy import SQLAlchemy

def insertCustomer(db: SQLAlchemy, data: dict[str, str]) -> None:
    query = 'INSERT INTO Bank.Customers VALUES (:_id, :_fname, :_lname, :_dob);'
    db.session.execute(text(query), data)
    db.session.commit()

def insertAddress(db: SQLAlchemy, data: dict[str, str]) -> None:
    query = 'INSERT INTO Bank.Customer_Addresses VALUES (:_id, :_addr, :_addr_type);'
    db.session.execute(text(query), data)
    db.session.commit()

def insertPhone(db: SQLAlchemy, data: dict[str, str]) -> None:
    query = 'INSERT INTO Bank.Customer_Phone_Numbers VALUES (:_id, :_phone, :_phone_type);'
    db.session.execute(text(query), data)
    db.session.commit()

def insertUser(db: SQLAlchemy, data: dict[str, str]) -> None:
    query = 'INSERT INTO Bank.Users VALUES (:_username, :_password, :_id, :_user_type);'
    db.session.execute(text(query), data)
    db.session.commit()

def getUserByName(db: SQLAlchemy, username: str) -> Row[t.Any]:
    query = 'SELECT b.username AS user, b.user_type AS type, b.password AS password, b.customer_id AS id ' \
            'FROM Bank.Users AS b ' \
            'WHERE b.username = :_name;'

    result = db.session.execute(text(query), {'_name': username})
    return result.one()._asdict()