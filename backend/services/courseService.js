// Import the query function from the db.config.js file
const conn = require("../config/db");
// A function to check if user exists in the database

async function checkIfCourseExists(course) {
  const query = "SELECT * FROM courses WHERE title = ? ";
  const rows = await conn.query(query, [course]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}
// A function to create a new user
async function createCourse(course) {
  let createCourse = {};
  try {
    // Insert the email in to the user table
    const query =
      "INSERT INTO courses (title, description, category_id, instructor_id) VALUES (?,?,?,?)";
    const rows = await conn.query(query, [
      course.title,
      course.description,
      course.category_id,
      course.instructor_id,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
  // Return the user object
  return createCourse;
}
// Get all categories
async function getAllCourse() {
  const query = `
  SELECT 
  c.course_id,
  c.title,
  c.description,
  cc.category_name 
  FROM courses c
  LEFT JOIN course_category cc
  ON c.category_id = cc.category_id
  ORDER BY c.course_id DESC`;
  const rows = await conn.query(query);
  
  if (rows) {
    console.log("Category -> ", rows);
    return rows;
  } else {
    console.log("Sm Error");
  }
}

module.exports = {
  createCourse,
  checkIfCourseExists,
  getAllCourse,
};
