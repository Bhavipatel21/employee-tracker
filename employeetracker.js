const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Warof1812$&git ',
  database: 'employee_DB',
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Add an Employee',
        'Remove an Employee',
        'Update an Employee Role',
        'Update an Employee Manager'
],
    })
    .then((answer) => {
    switch (answer.action) {

        case 'View All Employees':
        viewAllEmployee();
        break;

        case 'View All Employees By Department':
        viewEmpByDept();
        break;

        case 'View All Employees By Manager':
        viewEmpByMngr();
        break;

        case 'Add an Employee':
        addEmp();
        break;

        case 'Remove an Employee':
        removeEmp();
        break;
        
        case 'Update an Employee Role':
        updateEmpRole();
        break;

        case 'Update an Employee Manager':
        udpateEmpMngr();
        break;

        default:
        break;
    }
    });
};

