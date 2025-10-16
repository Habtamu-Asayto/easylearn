// db.js
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "easylearn",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool; // ✅ export the pool directly
