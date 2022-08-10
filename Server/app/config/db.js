const mysql = require("mysql");
// Create a connection to the database
// var connection = mysql.createPool({
//   host: "host.docker.internal",
//   user: "root",
//   password: "Pass1234!",
//   database: "reactcourse",
// });

var connection = mysql.createPool({
  host: process.env.HOST || "localhost" || host.docker.internal,
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "Pass1234!",
  database: process.env.NAME || "reactcourse",
});
// open the MySQL connection
connection.getConnection((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
module.exports = connection;
