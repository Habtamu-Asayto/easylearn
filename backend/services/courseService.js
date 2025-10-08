// Import the query function from db.config.js
const conn = require("../config/db");

// ✅ Check if a course with the same title already exists
async function checkIfCourseExists(courseTitle) {
  const query = "SELECT * FROM courses WHERE title = ?";
  const rows = await conn.query(query, [courseTitle]);
  console.log("checkIfCourseExists ->", rows);
  return rows.length > 0;
}

// ✅ Create a new course
async function createCourse(course) {
  try {
    const query = `
      INSERT INTO courses (title, description, category_id, instructor_id)
      VALUES (?, ?, ?, ?)
    `;
    // ❗ Don't destructure here — conn.query returns rows directly
    const result = await conn.query(query, [
      course.title,
      course.description,
      course.category_id,
      course.instructor_id,
    ]);

    console.log("DB insert result:", result);
    // OkPacket has affectedRows
    return result.affectedRows === 1;
  } catch (err) {
    console.error("createCourse error:", err);
    throw err;
  }
} 

// Update existing course
async function updateCourse(courseId, course) {
  try {
    const query = `
      UPDATE courses
      SET title = ?, description = ?, category_id = ?
      WHERE course_id = ?
    `;
    const result = await conn.query(query, [
      course.title,
      course.description,
      course.category_id,
      courseId,
    ]);

    console.log("updateCourse result:", result);
    return result.affectedRows === 1;
  } catch (err) {
    console.error("updateCourse error:", err);
    return false;
  }
}
 

// Get all courses
async function getAllCourse() {
  const query = `
    SELECT 
        c.course_id,
        c.title,
        c.description,
        c.category_id,
        ui.user_full_name AS instructor_name,
        c.created_at
    FROM courses c
    JOIN users u ON c.instructor_id = u.user_id
    JOIN user_info ui ON u.user_id = ui.user_id;
  `;
  const rows = await conn.query(query);
  // console.log("getAllCourse -> ", rows);
  return rows;
}

 
// Delete a course by ID
async function deleteCourse(courseId) {
  try {
    const result = await conn.query("DELETE FROM courses WHERE course_id = ?", [
      courseId,
    ]);
    // console.log("Delete result:", result);
    return result.affectedRows === 1;
  } catch (err) {
    console.error("Delete course error:", err);
    return false;
  }
}


 
module.exports = {
  createCourse,
  checkIfCourseExists,
  getAllCourse,
  updateCourse, 
  deleteCourse
};
