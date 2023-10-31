import uuid
from werkzeug.datastructures import ImmutableMultiDict
from werkzeug.security import generate_password_hash as hash

class Registration:

    def __init__(self, form: ImmutableMultiDict[str, str]):
        customer_id = uuid.uuid4()
        hashed_pass = hash(form['_password'])
        
        self.customer_info: dict[str, str] = {
            '_id': customer_id,
            '_fname': form['_fname'],
            '_lname': form['_lname'],
            '_dob': form['_dob']
        }
        self.customer_address: dict[str, str] = {
            '_id': customer_id,
            '_addr': form['_addr'],
            '_addr_type': form['_addr_type']
        }
        self.customer_phone: dict[str, str] = {
            '_id': customer_id,
            '_phone': form['_phone'],
            '_phone_type': form['_phone_type']
        }
        self.user_info: dict[str, str] = {
            '_username': form['_username'],
            '_password': hashed_pass,
            '_id': customer_id,
            '_user_type': 'User'
        }
