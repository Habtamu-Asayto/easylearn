// Import the query function from the db.config.js file
const conn = require("../config/db");
// A function to check if user exists in the database

async function checkIfCategoryExists(category) {
  const query = "SELECT * FROM course_category WHERE category_name = ? ";
  const rows = await conn.query(query, [category]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}
// A function to create a new user
async function createCategory(category) {
  let createCategory = {};
  try {
    // Insert the email in to the user table
    const query = "INSERT INTO course_category (category_name) VALUES (?)";
    const rows = await conn.query(query, [category.category_name]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
  // Return the user object
  return createCategory;
}
// Get all categories
async function getAllCategory() {
  const query = "SELECT * FROM course_category";
  const rows = await conn.query(query);
    
    if (rows) {
      console.log("Category -> ", rows);
      return rows;
    } else {
      console.log("Sm Error");
    }
}

module.exports = {
  createCategory,
  checkIfCategoryExists,
  getAllCategory,
};
