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