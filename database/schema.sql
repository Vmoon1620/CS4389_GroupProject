DROP SCHEMA IF EXISTS Bank;
CREATE SCHEMA Bank;
USE Bank;

CREATE TABLE Bank.Customers (
    customer_id CHAR(36) NOT NULL,
    fname VARCHAR(50),
    lname VARCHAR(50),
    dob DATE,
    CONSTRAINT pk_customer_id PRIMARY KEY (customer_id)
);

CREATE TABLE Bank.Users (
    username VARCHAR(100) NOT NULL,
    password VARBINARY(512) NOT NULL,
    customer_id CHAR(36),
    user_type VARCHAR(10),
    CONSTRAINT pk_username PRIMARY KEY (username),
    CONSTRAINT fk_users_customer_id 
        FOREIGN KEY (customer_id) 
        REFERENCES Bank.Customers (customer_id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_admin_not_customer CHECK (
        user_type = 'User' OR 
        (user_type = 'Admin' AND customer_id IS NULL)
    )

    -- Both the username and password fields should be encrypted/hashed for confidentiality.
    -- Use a hash and salt algorithm on passwords for the best security -> hash and compare.
    -- Cascading deletes ensure integrity of customer data.
    -- Admins cannot be customers (seperation of duty/least privilege principle) -> customerID should be null.
);

CREATE TABLE Bank.Customer_Addresses (
    customer_id CHAR(36) NOT NULL,
    address VARCHAR(80),
    addr_type VARCHAR(50),
    CONSTRAINT pk_customer_address PRIMARY KEY (customer_id, address),
    CONSTRAINT fk_address_customer_id 
        FOREIGN KEY (customer_id) 
        REFERENCES Bank.Customers (customer_id)
        ON DELETE CASCADE 

    -- Addresses are multivalued fields -> multiple allowed per customer.
);

CREATE TABLE Bank.Customer_Phone_Numbers (
    customer_id CHAR(36) NOT NULL,
    phone_number VARCHAR(50),
    number_type VARCHAR(50),
    CONSTRAINT pk_customer_phone PRIMARY KEY (customer_id, phone_number),
    CONSTRAINT fk_phone_customer_id 
        FOREIGN KEY (customer_id) 
        REFERENCES Bank.Customers (customer_id)
        ON DELETE CASCADE 

    -- Phone numbers are multivalued fields -> multiple allowed per customer.
);

CREATE TABLE Bank.Customer_Accounts (
    account_id CHAR(36) NOT NULL,
    customer_id CHAR(36), 
    balance DECIMAL(65, 2) NOT NULL,
    account_type VARCHAR(50),
    CONSTRAINT pk_account_id PRIMARY KEY (account_id),
    CONSTRAINT fk_account_customer_id 
        FOREIGN KEY (customer_id) 
        REFERENCES Bank.Customers(customer_id)
        ON DELETE CASCADE, 
    CONSTRAINT chk_balance_min_zero CHECK (balance >= 0)

    -- Money amounts are stored as fixed point to maintain integrity -> float types introduce errors from rounding
    -- Constraint on balances for integrity -> balance cannot be negative.
    -- Cascading changes ensures accounts are fully closed and data removed if customers leave.
);



CREATE TABLE Bank.Transactions (
    transaction_id CHAR(36) NOT NULL,
    account_id CHAR(36),
    -- proposed to merge transaction_time and transaction_date as 
    -- transaction_timestamp TIMESTAMP
    -- transaction_time TIME,
    -- transaction_date DATE,
    transaction_timestamp TIMESTAMP,
    transaction_type VARCHAR(50),
    amount DECIMAL(65, 2) NOT NULL,
    CONSTRAINT pk_transactions PRIMARY KEY (transaction_id),
    CONSTRAINT fk_transactions_account 
        FOREIGN KEY (account_id) 
        REFERENCES Bank.Customer_Accounts(account_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_amount_not_zero CHECK (amount != 0)

    -- Keep transactions even if accounts are closed to maintain a paper trail.
    -- Transactions must be a non-zero amount.
);

-- Triggers associated with transactions to automatically update account balance and maintain integrity.
-- Defines two different procedures, one for updates/deletes and another for inserts
DELIMITER $$
CREATE PROCEDURE on_new_transaction(
    account_id CHAR(36), 
    amount DECIMAL(65, 2)
) BEGIN
    UPDATE Bank.Customer_Accounts AS accounts
    SET accounts.balance = accounts.balance + amount
    WHERE accounts.account_id = account_id;
END $$

CREATE PROCEDURE on_update_transaction(
    account_id CHAR(36), 
    old_amount DECIMAL(65, 2), 
    new_amount DECIMAL(65, 2)
) BEGIN
    UPDATE Bank.Customer_Accounts AS accounts
    SET accounts.balance = (accounts.balance - old_amount) + new_amount
    WHERE accounts.account_id = account_id;
END$$

-- Three different triggers exist to call the correct procedure for transaction operations
CREATE TRIGGER trigger_update_transactions 
    BEFORE UPDATE ON Bank.Transactions 
    FOR EACH ROW 
BEGIN 
    IF OLD.amount != NEW.amount THEN
        CALL on_update_transaction(OLD.account_id, OLD.amount, NEW.amount);
    END IF;
END$$

CREATE TRIGGER trigger_insert_transactions 
    AFTER INSERT ON Bank.Transactions 
    FOR EACH ROW 
BEGIN
    CALL on_new_transaction(NEW.account_id, NEW.amount);
END$$

CREATE TRIGGER trigger_delete_transactions 
    AFTER DELETE ON Bank.Transactions 
    FOR EACH ROW 
BEGIN
    CALL on_update_transaction(OLD.account_id, OLD.amount, 0);
END$$
DELIMITER ;