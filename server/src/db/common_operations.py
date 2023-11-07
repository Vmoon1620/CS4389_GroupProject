from typing import Any
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

def getUserByName(db: SQLAlchemy, username: str) -> dict[str, Any]:
    query = 'SELECT b.username AS user, b.password AS password, b.customer_id AS id ' \
            'FROM Bank.Users AS b ' \
            'WHERE b.username = :_name;'

    result = db.session.execute(text(query), {'_name': username})
    return result.one()._asdict()

def getUserByID(db: SQLAlchemy, id: str) -> dict[str, Any]:
    query = """
            SELECT
                b.username AS user,
                c.first_name, c.last_name, c.date_of_birth,
                a.address, 
                p.phone_number
            FROM Bank.Users AS b 
            NATURAL JOIN (
                SELECT c_tmp.fname AS first_name, c_tmp.lname AS last_name, c_tmp.dob AS date_of_birth, c_tmp.customer_id
                FROM Bank.Customers AS c_tmp
            ) AS c 
            NATURAL JOIN (
                SELECT a_tmp.address, a_tmp.customer_id
                FROM Bank.Customer_Addresses AS a_tmp
            ) AS a 
            NATURAL JOIN (
                SELECT p_tmp.phone_number, p_tmp.customer_id AS id
                FROM Bank.Customer_Phone_Numbers AS p_tmp
            ) AS p
            WHERE b.customer_id = :_id;
            """
    result = db.session.execute(text(query), {'_id': id})
    return result.first()._asdict()