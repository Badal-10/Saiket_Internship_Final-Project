require("dotenv").config();
const mysql = require("mysql2");


const pool = mysql.createPool({
  host: process.env.DB_HOST,                 // localhost
  user: process.env.DB_USER,                 // root (or your MySQL user)
  password: process.env.DB_PASS,             // your MySQL password
  database: process.env.DB_NAME,             // Internship_db
  port: process.env.DB_PORT || 3306
});


module.exports = pool.promise();
