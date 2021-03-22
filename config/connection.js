const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Warof1812$&',
  database: 'employee_DB',

});

module.exports = connection
