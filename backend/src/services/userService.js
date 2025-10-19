// Import the query function from the db.config.js file
const conn = require("../config/db");
// Import the bcrypt module
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/mailer");
require("dotenv").config();

// A function to check if user exists in the database
async function checkIfUserExists(email) {
  const query = "SELECT * FROM users WHERE user_email = ? ";
  const rows = await conn.query(query, [email]);
  // console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new user
async function createUser(user) {
  // const createUser=
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.user_password, salt);

    // Insert the email in to the user table
    const query = "INSERT INTO users (user_email, is_verified) VALUES (?, ?)";
    const rows = await conn.query(query, [user.user_email, 0]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
    // Get the User id from the insert
    const user_id = rows.insertId;
    const query2 =
      "INSERT INTO user_info (user_id, user_full_name, user_phone) VALUES (?, ?, ?)";
    const rows2 = await conn.query(query2, [
      user_id,
      user.user_full_name,
      user.user_phone,
    ]);
    const query3 =
      "INSERT INTO user_pass (user_id, user_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [user_id, hashedPassword]);

    const query4 = "INSERT INTO user_role (user_id,role_name) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [user_id, user.user_role_id]);
    console.log("You did it ");

    // --- Generate verification token ---
    const token = crypto.randomBytes(32).toString("hex");
    const hours = parseInt(
      process.env.VERIFICATION_TOKEN_EXPIRES_HOURS || "24",
      10
    );
    const expires = new Date(Date.now() + hours * 3600 * 1000);

    const updateTokenQuery = `
      UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE user_id = ?
    `;
    await conn.query(updateTokenQuery, [token, expires, user_id]);
    // Send verification email (do not await to avoid long response? better to await and handle errors)
    try {
      await sendVerificationEmail(user.user_email, user.user_full_name, token);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
      // You may want to continue (user created) or rollback — choose based on requirements.
    }

    // Return created user_id or minimal object
    return { user_id };
  } catch (err) {
    console.error("createUser error:", err);
    return false;
  }
}
// A function to create a new user
async function createStudent(user) {
  let createdStudent = {};
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.student_password, salt);

    // Insert the email in to the user table
    const query = "INSERT INTO users (user_email) VALUES (?)";
    const rows = await conn.query(query, [user.student_email]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
    // Get the User id from the insert
    const user_id = rows.insertId;
    const query2 =
      "INSERT INTO user_info (user_id, user_full_name, user_phone) VALUES (?, ?, ?)";
    const rows2 = await conn.query(query2, [
      user_id,
      user.student_name,
      user.student_phone,
    ]);
    const query3 =
      "INSERT INTO user_pass (user_id, user_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [user_id, hashedPassword]);

    const query4 = "INSERT INTO user_role (user_id,role_name) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [user_id, 3]);
    console.log("You did it ");

    // construct to the user object to return
    createStudent = {
      user_id: user_id,
    };
  } catch (err) {
    console.log(err);
  }
  // Return the user object
  return createStudent;
}

// A function to get user by email
async function getUserByEmail(user_email) {
  const query = `
  SELECT * FROM users 
LEFT JOIN user_info ON users.user_id = user_info.user_id 
LEFT JOIN user_pass ON users.user_id = user_pass.user_id 
LEFT JOIN user_role ON users.user_id = user_role.user_id 
WHERE users.user_email = ?`;
  const rows = await conn.query(query, [user_email]);
  return rows;
}

// A function to get all employees
async function getAllStudents() {
  const query = `
    SELECT * 
    FROM users 
    INNER JOIN user_info ON users.user_id = user_info.user_id 
    INNER JOIN user_role ON users.user_id = user_role.user_id  
     WHERE user_role.role_name = ?
    ORDER BY USERS.user_id DESC 
    limit 10`;
  const rows = await conn.query(query, [3]);
  return rows;
}
// Export the functions for use in the controller
module.exports = {
  checkIfUserExists,
  createUser,
  getUserByEmail,
  getAllStudents,
  createStudent,
};
