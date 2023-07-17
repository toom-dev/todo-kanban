const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'nexumapp.ddns.net',
  user: 'root',
  password: '@Clay10@12',
  database: 'todo'
})

module.exports = connection;