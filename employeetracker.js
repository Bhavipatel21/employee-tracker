const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');
require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Warof1812$&',
  database: 'employee_DB',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(figlet.textSync('Employee Tracker'));
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
          left join department d on r.dept_id = d.dept_id`

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
    order by d.dept_name`

    connection.query(query, (err, res) => {
      console.table(res);
      runSearch();
    });
  };

  //function to add new employee
  const addEmp = () => {

    connection.query('SELECT role_id, title, salary,dept_id FROM role', (err, res) => {
      if (err) throw err;

      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'Please enter the first name of the new employee: ',
          validate: function validateInput(name) {
            return name !== '';
          }
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'Please enter the last name of the new employee: ',
          validate: function validateInput(name) {
            return name !== '';
          }
        },
        {
          name: 'choose_role',
          type: 'rawlist',
          choices() {
            const choices = [];
            res.forEach(({ title }) => {
              choices.push(title);
            })
            return choices;
          },
          message: 'Choose role for new employee: ',
        }
      ])
        .then((data) => {
          let roleID;
          res.forEach((res) => {
            if (res.title === data.choose_role) {
              roleID = res.dept_id;
            }
          })

          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: data.first_name,
              last_name: data.last_name,
              role_id: roleID
            },
            (err) => {
              if (err) throw err;

              console.log(`New Employee ${data.first_name} ${data.last_name} added!`);

              runSearch();
            })

        })

    });
  }



  

};





