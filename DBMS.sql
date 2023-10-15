Create Table Customer(
    CustomerID CHAR(36) Not Null,
     FirstName VARCHAR(50),
     LastName VARCHAR(50),
     DateOfBirth DATE,
     SSN CHAR (11),
     PRIMARY Key (CustomerID)
)



-- @block
INSERT INTO customer (CustomerID, FirstName, LastName, DateOfBirth, SSN) values ('994cd3ba-16a0-417a-922f-02ae4391787a', 'Jacqui', 'Corker','2006-11/18', '621-05-7851');



-- @block
select * from Customer;


-- @block
Create Table Customer_Address(
    FK_CustomerAddress CHAR(36) Not Null,
    CustomerAddress VARCHAR(80),
    AddressType VARCHAR(50),
    PRIMARY Key (FK_CustomerAddress),
    Foreign Key (FK_CustomerAddress) References Customer (CustomerID) 
);

-- @block
INSERT INTO customer_address (FK_CustomerAddress, CustomerAddress, AddressType) values ('994cd3ba-16a0-417a-922f-02ae4391787a', '78 Bonner Lane', 'Residential');



-- @block
select * from customer_address;

-- @block
CREATE Table Customer_PhoneNumber(
    FK_CustomerPhoneNumber CHAR(36) Not Null,
    PhoneNumber VARCHAR(50),
    PhoneNumberType VARCHAR(50),
    PRIMARY Key (FK_CustomerPhoneNumber),
    Foreign Key (FK_CustomerPhoneNumber) References Customer (CustomerID) 

)

-- @block 
INSERT INTO Customer_PhoneNumber (FK_CustomerPhoneNumber, PhoneNumber, PhoneNumberType) values ('994cd3ba-16a0-417a-922f-02ae4391787a', '(395)-516-1576', 'Home');


-- @block
select * from customer_phonenumber;

-- @block
    SELECT *
    FROM Customer
    JOIN Customer_Address ON Customer.CustomerID = Customer_Address.FK_CustomerAddress
    JOIN Customer_PhoneNumber ON Customer.CustomerID = Customer_PhoneNumber.FK_CustomerPhoneNumber;



-- @block
SELECT Customer.CustomerID, 
		Customer.FirstName, 
		Customer.LastName, 
		Customer.DateOfBirth, 
		Customer.SSN, 
		Customer_Address.CustomerAddress, 
		Customer_Address.AddressType, 
		Customer_PhoneNumber.PhoneNumberType
FROM Customer
JOIN Customer_Address ON Customer.CustomerID = Customer_Address.FK_CustomerAddress
JOIN Customer_PhoneNumber ON Customer.CustomerID = Customer_PhoneNumber.FK_CustomerPhoneNumber;



-- @block
Create Table Accounts(
    AccountID CHAR(36) Not Null,
    FK_CustomerID CHAR(36), 
    AccountBalance FLOAT,
    AccountType VARCHAR(50),
    PRIMARY Key (AccountID),
    Foreign Key (FK_CustomerID) References Customer(CustomerID)
);


-- @block
INSERT INTO accounts (AccountID, FK_CustomerID, AccountBalance, AccountType) values ('6547fea-8198-4fdd-9637-fd090d07779', '994cd3ba-16a0-417a-922f-02ae4391787a', '8220.31', 'Saving');


-- @block
select * from accounts;
