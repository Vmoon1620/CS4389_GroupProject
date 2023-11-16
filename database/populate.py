import csv, os, sys
import datetime

from decimal import Decimal
from pathlib import Path
from typing import Any

from werkzeug.security import generate_password_hash as hash

def __readCSVFile(file: str) -> list[Any]:
    """ -----------------------------------------------------------------------
    Reads the specified csv file into a list of rows.
    ----------------------------------------------------------------------- """
    rows = []
    with open(file, "r") as csv_file:
        reader = csv.reader(csv_file)
        next(reader) # skip the header row
        for row in reader:
            if (len(row) > 0):
                rows.append(row)
    return rows

def __insert(row: list[Any], table: str) -> str:
    """ -----------------------------------------------------------------------
    Generates insert statements for the specified table and list of values
    to insert.

    Args:
        row (list[str]) - the list of values to generate inserts for.
        table (str) - the name of the table to insert into.
    ----------------------------------------------------------------------- """
    sql = "INSERT INTO Bank." + table + " VALUES ("
    last = row[len(row) - 1]
    for field in row:
        if (type(field) == str):
            sql += f"\"{field}\""
        elif (field is None):
            sql += "NULL"
        else:
            sql += f"{field}"
        if (field != last):
            sql += ","
    return sql + ");\n"

def __genCustomerInserts(customer_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv customer data.
    ----------------------------------------------------------------------- """
    out_rows = []

    for record in customer_data:

        customerID = record[0]
        fname = record[1]
        lname = record[2]
        # convert the date format to MySQL readable format
        dob = datetime.datetime.strptime(record[3], "%m/%d/%Y").strftime("%Y-%m-%d")

        row = [customerID, fname, lname, dob]
        out_rows.append(__insert(row, "Customers"))

    return out_rows

def __genUserInserts(user_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv user data.
    ----------------------------------------------------------------------- """
    out_rows = []

    for record in user_data:

        customerID = record[0]
        type = record[1]
        username = record[2]
        password = hash(record[3])

        if (type == "Admin"):
            customerID = None
        row = [username, password, customerID, type]
        out_rows.append(__insert(row, "Users"))

    return out_rows

def __genAddressInserts(address_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv address data.
    ----------------------------------------------------------------------- """
    out_rows = []

    for record in address_data:

        customerID = record[0]
        address = record[1]
        type = record[2]

        row = [customerID, address, type]
        out_rows.append(__insert(row, "Customer_Addresses"))

    return out_rows

def __genPhoneInserts(phone_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv phone data.
    ----------------------------------------------------------------------- """
    out_rows = []

    for record in phone_data:

        number = record[0]
        customerID = record[1]
        type = record[2]

        row = [customerID, number, type]
        out_rows.append(__insert(row, "Customer_Phone_Numbers"))

    return out_rows

def __genAccountInserts(account_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv account data.
    ----------------------------------------------------------------------- """
    out_rows = []
    for record in account_data:

        accountID = record[0]
        customerID = record[1]
        type = record[2]
        balance = Decimal(record[3])

        row = [accountID, customerID, balance, type]
        out_rows.append(__insert(row, "Customer_Accounts"))

    return out_rows

def __genTransactionInserts(transaction_data: list[Any]) -> list[Any]:
    """ -----------------------------------------------------------------------
    Generates a list of insert statements from the csv transaction data.
    ----------------------------------------------------------------------- """
    out_rows = []

    for transaction_row in transaction_data:

        transactionID = transaction_row[0]
        accountID = transaction_row[1]
        timestamp = transaction_row[2]
        amount = Decimal(transaction_row[3])
        type = transaction_row[4]

        row = [transactionID, accountID, timestamp, type, amount]
        out_rows.append(__insert(row, "Transactions"))
    return out_rows

def __main() -> int:
    """ -----------------------------------------------------------------------
    Reads in all the csv data and generates insert statements for every
    record. Writes all the inserts to 'inserts.sql'
    ----------------------------------------------------------------------- """

    if (len(sys.argv) < 2):
        print("Usage: python populate.py <out file>")
        exit(1)
        
    path = Path(__file__).resolve().parent
    customer_data = __readCSVFile(os.path.join(path, "Mock Data/customers_mock_data.csv"))
    user_data = __readCSVFile(os.path.join(path,"Mock Data/users_mock_data.csv"))
    address_data = __readCSVFile(os.path.join(path,"Mock Data/addresses_mock_data.csv"))
    phone_data = __readCSVFile(os.path.join(path,"Mock Data/phone_mock_data.csv"))
    accounts_data = __readCSVFile(os.path.join(path,"Mock Data/accounts_mock_data.csv"))
    transactions_data = __readCSVFile(os.path.join(path,"Mock Data/transactions_mock_data.csv"))

    out_rows = []
    out_rows.extend(__genCustomerInserts(customer_data))
    out_rows.extend(__genUserInserts(user_data))
    out_rows.extend(__genAddressInserts(address_data))
    out_rows.extend(__genPhoneInserts(phone_data))
    out_rows.extend(__genAccountInserts(accounts_data))
    out_rows.extend(__genTransactionInserts(transactions_data))

    with open(sys.argv[1], "w") as out:
        for row in out_rows:
            out.write(row)
    
    return 0

if __name__ == '__main__':
    sys.exit(__main())

