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

#inserting functions for views for Customer_Account
# def insertCustomerAccount(db, data):
#     query = 'INSERT INTO Bank.Customer_Accounts VALUES (:_account_id, :_customer_id, :_balance, :_account_type);'
#     db.session.execute(text(query), data)
#     db.session.commit()

#inserting function for getACcountInfoByCustomerID
def getAccountsByCustomerID(db: SQLAlchemy, customer_id: str) -> dict[str, Any]:
    query = """
            SELECT
                ca.account_type AS type,
                ca.account_id AS id,
                ca.balance AS balance
            FROM Bank.Customer_Accounts AS ca
            NATURAL JOIN Bank.Customers AS cu
            WHERE cu.customer_id = :_customer_id;
            """

    result = db.session.execute(text(query), {'_customer_id': customer_id})
    return [r._asdict() for r in result.all()]


#inserting function for getACcountInfoByAccountID
def getAccountTransactions(db: SQLAlchemy, account_id: str) -> dict[str, Any]:
    query = """
            SELECT
                t.transaction_id AS id,
                t.account_id AS account_id,
                t.transaction_timestamp AS timestamp,
                t.transaction_type AS type,
                t.amount AS amount
            FROM Bank.Transactions AS t
            WHERE t.account_id = :_account_id;
            """
    result = db.session.execute(text(query), {'_account_id': account_id})
    return [r._asdict() for r in result.all()]

def doesUserOwnAccount(db: SQLAlchemy, customer_id: str, account_id: str) -> bool:
    query = """
            SELECT Count(*)
            FROM (
                SELECT a.customer_id AS id
                FROM Bank.Customer_Accounts AS a
                WHERE a.account_id = :_account_id
            ) AS temp
            WHERE temp.id = :_customer_id;
            """
    result = db.session.execute(
        text(query), {'_customer_id': customer_id, '_account_id': account_id}
    )
    return result.first()._asdict()['Count(*)'] > 0