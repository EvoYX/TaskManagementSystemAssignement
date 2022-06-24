const mysql = require("mysql");
// Create a connection to the database
var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pass1234!",
  database: "reactcourse",
});
// open the MySQL connection
connection.getConnection((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
module.exports = connection;
