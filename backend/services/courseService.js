// Import the query function from db.config.js
const conn = require("../config/db");

// Check if a course with the same title already exists
async function checkIfCourseExists(courseTitle) {
  const query = "SELECT * FROM courses WHERE title = ?";
  const rows = await conn.query(query, [courseTitle]);
  // console.log("checkIfCourseExists ->", rows);
  return rows.length > 0;
}

// Create a new course
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

// Create a new Overview
async function createOverview(overview) {
  try {
    const query = `
      INSERT INTO course_overview (overview_detail, required_skill, duration, course_id)
      VALUES (?, ?, ?, ?)
    `;
    // ❗ Don't destructure here — conn.query returns rows directly
    const result = await conn.query(query, [
      overview.overview_detail,
      overview.required_skill,
      overview.duration,
      overview.course_id,
    ]);

    console.log("DB insert result:", result);
    // OkPacket has affectedRows
    return result.affectedRows === 1;
  } catch (err) {
    console.error("createCourse error:", err);
    throw err;
  }
}

// Create a new Overview
async function updateOverview(overview) {
  try {
    const query = `
      UPDATE course_overview 
      SET overview_detail=?, required_skill=?, duration=?, certificate=? 
      WHERE course_id=?
    `;
    const result = await conn.query(query, [
      overview.overview_detail,
      overview.required_skill,
      overview.duration,
      overview.certificate,
      overview.course_id,
    ]);

    console.log("DB update result:", result);
    return result.affectedRows === 1;
  } catch (err) {
    console.error("error:", err);
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
    c.created_at,
    c.updated_at,
    co.overview_id,
    co.overview_detail,
    co.required_skill,
    co.duration,
    co.certificate,
    co.created_at AS overview_created_at,
    co.updated_at AS overview_updated_at
FROM courses c
JOIN users u ON c.instructor_id = u.user_id
JOIN user_info ui ON u.user_id = ui.user_id
LEFT JOIN course_overview co ON c.course_id = co.course_id;
`;
  const rows = await conn.query(query);
  // console.log("getAllCourse -> ", rows);
  return rows;
}

// async function checkOverview(courseID) {
//   const query = `SELECT * FROM course_overview WHERE course_id = ?;`;
//   const rows = await conn.query(query, [courseID]);
//   // console.log("checkIfCourseExists ->", rows);
//   return rows.length > 0;
// }

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
  deleteCourse,
  createOverview,
  updateOverview, 
};
