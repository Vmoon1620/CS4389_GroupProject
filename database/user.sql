DROP USER IF EXISTS 'demo'@'localhost';
CREATE USER 'demo'@'localhost' IDENTIFIED BY '123';
GRANT SELECT ON Bank.* TO 'demo'@'localhost';
GRANT INSERT ON Bank.Users TO 'demo'@'localhost';
GRANT INSERT ON Bank.Customers TO 'demo'@'localhost';
GRANT INSERT ON Bank.Customer_Addresses TO 'demo'@'localhost';
GRANT INSERT ON Bank.Customer_Phone_Numbers TO 'demo'@'localhost';
FLUSH PRIVILEGES;