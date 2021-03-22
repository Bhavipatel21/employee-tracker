DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE Department (
    dept_id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY(dept_id)

);
CREATE TABLE Role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,4),
    dept_id INT NOT NULL,
    PRIMARY KEY(role_id),
    FOREIGN KEY (dept_id) REFERENCES department (dept_id) 
);

CREATE TABLE Employee (
    emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(emp_id),
    FOREIGN KEY (role_id) REFERENCES role (role_id),
    FOREIGN KEY (manager_id) REFERENCES employee (emp_id) 

);
--INSERT data into Department table--
INSERT INTO Department (dept_name)
VALUE ("IT"),("Operations"),("Accounting"),("Retail");

--INSERT data into Role table--
INSERT INTO Role (title, salary, dept_id)
VALUES 
("QA Analyst", 150000, 1),
("Business Analyst", 125000, 1),
("Operation Lead", 100000, 2),
("Supply Chain Specialist", 80000, 2),
("CPA", 120000, 3),
("Accounting Manager", 190000, 3),
("Software Engineer", 120000, 3),
("Cashier", 90000, 4),
("Sales Associate", 100000, 4);

--INSERT data into Employee table--
INSERT INTO Employee (first_name, last_name, manager_id, role_id)
VALUES 
("Ted", "Mosby", null, 1),
("Marshall", "Eriksen", null, 2),
("Robin","Scherbatsky",null,3),
("Barney", "Stinson", 1, 4),
("Lily", "Aldrin", 4, 5),
("Tracy", "McConnell", 1, 6),
("Kevin", "Penn", 2, 8)
("Bob", "Saget", 2, 9);
