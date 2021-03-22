const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet");
require("console.table");
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "Warof1812$&",
  database: "employee_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(figlet.textSync("Employee Tracker"));
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "Add an Employee",
        "Update an Employee Role",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployee();
          break;

        case "View All Employees By Department":
          viewEmpByDept();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update an Employee Role":
          updateEmpRole();
          break;

        default:
          break;
      }
    });
  //View All Employee
  const viewAllEmployee = () => {
    const query = `SELECT 
          e.emp_id,
          e.first_name,
          e.last_name,
          e.role_id,
          e.manager_id,
          r.role_id,
          r.title,
          r.salary,
          r.dept_id,
          d.dept_id,
          d.dept_name
          FROM employee_db.Employee e
          left join role r on e.role_id = r.role_id
          left join department d on r.dept_id = d.dept_id`;

    connection.query(query, (err, res) => {
      console.table(res);
      runSearch();
    });
  };
  //Vew Employee By Department
  const viewEmpByDept = () => {
    const query = `SELECT 
    concat( e.first_name, ',', e.last_name) as EmployeeFullName,
    d.dept_name as DepartmentName
    FROM employee_db.Employee e
    left join role r on e.role_id = r.role_id
    left join department d on r.dept_id = d.dept_id
    order by d.dept_name`;

    connection.query(query, (err, res) => {
      console.table(res);
      runSearch();
    });
  };

  //function to add new employee
  const addEmployee = () => {
    connection.query(
      "SELECT role_id, title, salary,dept_id FROM role",
      (err, res) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              name: "first_name",
              type: "input",
              message: "Please enter the first name of the new employee: ",
              validate: function validateInput(name) {
                return name !== "";
              },
            },
            {
              name: "last_name",
              type: "input",
              message: "Please enter the last name of the new employee: ",
              validate: function validateInput(name) {
                return name !== "";
              },
            },
            {
              name: "choose_role",
              type: "rawlist",
              choices() {
                const choices = [];
                res.forEach(({ title }) => {
                  choices.push(title);
                });
                return choices;
              },
              message: "Choose role for new employee: ",
            },
          ])
          .then((data) => {
            let roleID;
            res.forEach((res) => {
              if (res.title === data.choose_role) {
                roleID = res.dept_id;
              }
            });

            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: roleID,
              },
              (err) => {
                if (err) throw err;

                console.log(
                  `New Employee ${data.first_name} ${data.last_name} added!`
                );

                runSearch();
              }
            );
          });
      }
    );
  };

  //Update Employee

  const updateEmpRole = () => {
    connection.query(
      `SELECT 
  e.emp_id,
  e.first_name,
  e.last_name,
  e.manager_id,
  e.role_id,
  r.role_id,
  r.title,
  r.salary,
  r.dept_id
  FROM employee_db.Employee e
  left join employee_db.role r on e.role_id = r.role_id;`,
      (err, res) => {
        if (err) throw err;
        console.table(res);

        inquirer
          .prompt([
            {
              type: "input",
              name: "idUpdate",
              message: "Please enter the employee id number to update ",
            },
            {
              type: "input",
              name: "newId",
              message: "Please enter the updated role id for this employee ",
            },
          ])
          .then((res) => {
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: res.newId,
                },
                {
                  emp_id: res.idUpdate,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(
                  "The employees role has been updated successfully !!! "
                );
                viewAllEmployee();
              }
            );
          });
      }
    );
  };
};
