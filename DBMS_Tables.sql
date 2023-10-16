Create Table Customer(
    CustomerID CHAR(36) Not Null,
     FirstName VARCHAR(50),
     LastName VARCHAR(50),
     DateOfBirth DATE,
     SSN CHAR (11),
     PRIMARY Key (CustomerID)
);

Create Table Customer_Address(
    FK_CustomerAddress CHAR(36) Not Null,
    CustomerAddress VARCHAR(80),
    AddressType VARCHAR(50),
    PRIMARY Key (FK_CustomerAddress),
    Foreign Key (FK_CustomerAddress) References Customer (CustomerID) 
);

CREATE Table Customer_PhoneNumber(
    FK_CustomerPhoneNumber CHAR(36) Not Null,
    PhoneNumber VARCHAR(50),
    PhoneNumberType VARCHAR(50),
    PRIMARY Key (FK_CustomerPhoneNumber),
    Foreign Key (FK_CustomerPhoneNumber) References Customer (CustomerID) 

);

Create Table Accounts(
    AccountID CHAR(36) Not Null,
    FK_CustomerID CHAR(36), 
    AccountBalance FLOAT,
    AccountType VARCHAR(50),
    PRIMARY Key (AccountID),
    Foreign Key (FK_CustomerID) References Customer(CustomerID)
);

Create Table Transactions(
    TranscationID CHAR(36) Not Null,
    FK_AccountID CHAR(36),
    TranscationTime TIME,
    TranscationDate DATE,
    TransactionType VARCHAR(50),
    TranscationAmount FLOAT,
    PRIMARY Key (TranscationID),
    Foreign Key (FK_AccountID) References Accounts(AccountID)
);

CREATE TABLE Users (
    UserID CHAR(36) Not Null,
    UserLogin VARCHAR(50),
    UserPassword VARCHAR(50),
    FK_CustomerID CHAR(36),
    UserType VARCHAR(10),
    PRIMARY Key (UserID),
    Foreign Key (FK_CustomerID) References Customer (CustomerID)
);


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





