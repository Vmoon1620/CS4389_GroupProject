Create Table Customer(
    CustomerID CHAR(36) Not Null,
     FirstName VARCHAR(50),
     LastName VARCHAR(50),
     DateOfBirth DATE,
     SSN CHAR (11),
     PRIMARY Key (CustomerID)
);

Create Table Customer_Address(
    /* this is going to be the same UUID from Customer.CustomerID */
    FK_CustomerAddress CHAR(36) Not Null, 
    CustomerAddress VARCHAR(80),
    AddressType VARCHAR(50),
    /* since this is multivalue attribute we have the Primary key as follows */
    PRIMARY Key (FK_CustomerAddress, CustomerAddress), 
    Foreign Key (FK_CustomerAddress) References Customer (CustomerID) 
);

CREATE Table Customer_PhoneNumber(
    /* This is going to be the same UUID from Customer.CustomerID */
    FK_CustomerPhoneNumber CHAR(36) Not Null,
    PhoneNumber VARCHAR(50),
    PhoneNumberType VARCHAR(50),
    /* Similarly bc this table is multivalued, it has two attributes tied for its primary keys */
    PRIMARY Key (FK_CustomerPhoneNumber, PhoneNumber), 
    Foreign Key (FK_CustomerPhoneNumber) References Customer (CustomerID) 

);

Create Table Accounts(
    /* this is unique uuid to follow the format */
    AccountID CHAR(36) Not Null,
    FK_CustomerID CHAR(36), 
    /* this is going to be the same UUID from Customer.CustomerID */
    AccountBalance FLOAT,
    AccountType VARCHAR(50),
    /* Also made this change since its also a multivariate. Logic is a customer can have multiple accounts*/
    PRIMARY Key (AccountID, AccountType), 
    Foreign Key (FK_CustomerID) References Customer(CustomerID)
);

Create Table Transactions(
    /* unique uuid */
    TranscationID CHAR(36) Not Null,
    /* this will be exactly the same as account.accountID */
    FK_AccountID CHAR(36),
    TranscationTime TIME,
    TranscationDate DATE,
    TransactionType VARCHAR(50),
    TranscationAmount FLOAT,
    /* Note that is Primary Key is made from a double attribute */
    PRIMARY Key (TranscationID,TransactionType),
    Foreign Key (FK_AccountID) References Accounts(AccountID)
);

CREATE TABLE Users (
    /* this record is new to follow the formatting of the other tables */
    UserID CHAR(36) Not Null, 
    UserLogin VARCHAR(50),
    UserPassword VARCHAR(50),
    /*this is going to be the same UUID from customer.CustomerID */
    FK_CustomerID CHAR(36),
    UserType VARCHAR(10),
    PRIMARY Key (UserID),
    Foreign Key (FK_CustomerID) References Customer (CustomerID)
);

/*
If I am an admin I would have
    - UserID
    - FirstName
    - LastName
    - Username
    - Password

*/
SELECT 
    Customer.CustomerID,
    Customer.FirstName,
    Customer.LastName,
    Customer.DateOfBirth,
    Customer.SSN,
    Customer_Address.CustomerAddress,
    Customer_Address.AddressType,
    Customer_PhoneNumber.PhoneNumber,
    Customer_PhoneNumber.PhoneNumberType,
    Users.UserLogin,
    Users.UserPassword,
    Accounts.AccountBalance,
    Accounts.AccountType,
    Transactions.TranscationTime, 
    Transactions.TranscationDate, 
    Transactions.TransactionType, 
    Transactions.TranscationAmount
FROM 
    Customer
JOIN 
    Customer_Address ON Customer.CustomerID = Customer_Address.FK_CustomerAddress
JOIN 
    Customer_PhoneNumber ON Customer.CustomerID = Customer_PhoneNumber.FK_CustomerPhoneNumber
JOIN 
    Users ON Customer.CustomerID = Users.FK_CustomerID
JOIN 
    Accounts ON Customer.CustomerID = Accounts.FK_CustomerID
LEFT JOIN
    Transactions ON Accounts.AccountID = Transactions.FK_AccountID;
