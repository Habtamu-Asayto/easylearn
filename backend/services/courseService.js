// Import the query function from db.config.js
const conn = require("../config/db");

const conn2 = require("../config/db2"); // adjust path
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
      INSERT INTO course_overview (overview_detail, required_skill, duration, certificate, course_id)
      VALUES (?, ?, ?, ?,?)
    `;
    // ❗ Don't destructure here — conn.query returns rows directly
    const result = await conn.query(query, [
      overview.overview_detail,
      overview.required_skill,
      overview.duration,
      overview.certificate,
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

const updateLesson = async (lessonId, lessonData) => {
  const { title, content, video_url } = lessonData;

  const [result] = await conn2.query(
    `UPDATE lessons 
     SET title = ?, content = ?, video_url = ?, updated_at = NOW() 
     WHERE lesson_id = ?`,
    [title, content, video_url, lessonId]
  );

  return result;
};

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
      co.updated_at AS overview_updated_at,
      le.lesson_id,
      le.title AS lesson_title,
      le.content,
      le.video_url,
      le.created_at AS lesson_created_at,
      le.updated_at AS lesson_updated_at
    FROM courses c
    LEFT JOIN user_info ui ON c.instructor_id = ui.user_id
    LEFT JOIN course_overview co ON c.course_id = co.course_id
    LEFT JOIN lessons le ON c.course_id = le.course_id
    ORDER BY c.course_id, le.lesson_id;
  `;

  const rows = await conn.query(query);

  const courses = [];
  const map = new Map();

  rows.forEach((row) => {
    if (!map.has(row.course_id)) {
      map.set(row.course_id, {
        course_id: row.course_id,
        title: row.title,
        description: row.description,
        category_id: row.category_id,
        instructor_name: row.instructor_name,
        created_at: row.created_at,
        updated_at: row.updated_at,
        overview: row.overview_id
          ? {
              overview_id: row.overview_id,
              overview_detail: row.overview_detail,
              required_skill: row.required_skill,
              duration: row.duration,
              certificate: !!row.certificate,
              created_at: row.overview_created_at,
              updated_at: row.overview_updated_at,
            }
          : null, // <-- null if no overview
        lessons: [],
      });
      courses.push(map.get(row.course_id));
    }

    if (row.lesson_id) {
      map.get(row.course_id).lessons.push({
        lesson_id: row.lesson_id,
        title: row.lesson_title,
        content: row.content,
        video_url: row.video_url,
        created_at: row.lesson_created_at,
        updated_at: row.lesson_updated_at,
      });
    }
  });

  return courses;
}

async function deleteCourse(courseId) {
  if (!courseId) throw new Error("Course ID is required");

  try {
    // Delete child rows first
    await conn.query("DELETE FROM course_overview WHERE course_id = ?", [
      courseId,
    ]);
    await conn.query("DELETE FROM lessons WHERE course_id = ?", [courseId]);

    // Delete the main course
    const result = await conn.query("DELETE FROM courses WHERE course_id = ?", [
      courseId,
    ]);

    // Return true only if main course deleted
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Delete course error:", err);
    throw err;
  }
}

async function deleteLesson(lessonId) {
  if (!lessonId) throw new Error("Lesson ID is required");

  try {
    // Delete the main course
    const result = await conn.query("DELETE FROM lessons WHERE lesson_id = ?", [
      lessonId,
    ]);

    // Return true only if main course deleted
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Delete course error:", err);
    throw err;
  }
}

async function addLessons(lessons) {
  if (!Array.isArray(lessons) || lessons.length === 0) {
    throw new Error("No lessons provided");
  }

  try {
    const placeholders = lessons.map(() => "(?,?,?,?)").join(",");
    const values = [];

    lessons.forEach((l) => {
      values.push(l.course_id, l.lesson_title, l.content, l.video_url || null);
    });

    const query = `
      INSERT INTO lessons (course_id, title, content, video_url)
      VALUES ${placeholders}
    `;

    // now conn.query returns [rows, fields]
    const [result] = await conn2.query(query, values);
    console.log("Insert result:", result);
    return result;
  } catch (err) {
    console.error("Add lesson error:", err);
    throw err;
  }
}
const getLessonsByCourseService = async (courseId) => {
  console.log("Query result 1: ", courseId);

  const [rows] = await conn2.query(
    `SELECT * FROM lessons WHERE course_id = ?;`,
    [courseId]
  );
  console.log("Query result:", rows);
  return rows;
};

// Check if a quiz exists for a lesson
async function getQuizzesByLesson(lessonId) {   
  try {
    const [rows] = await conn2.query(
      `SELECT quiz_id FROM Quiz WHERE lesson_id = ?`,
      [lessonId]
    );
    return rows; // empty array if no quiz
  } catch (err) {
    // console.error("getQuizzesByLesson error:", err);
    throw err;
  }  
}


async function createQuiz(quizData) { 
  try { 
    // 1️⃣ Insert quiz
    const [quizResult] = await conn2.query(
      `INSERT INTO Quiz (question, question_type, points, lesson_id) VALUES (?, ?, ?, ?)`,
      [
        quizData.question,
        quizData.question_type,
        quizData.points,
        quizData.lesson_id,
      ]
    );
    const quizId = quizResult.insertId;

    // 2️⃣ Insert options if multiple_choice
    if (
      quizData.question_type === "multiple_choice" &&
      quizData.options?.length > 0
    ) {
      const optionValues = quizData.options.map((opt) => [
        quizId,
        opt.text,
        opt.isCorrect,
      ]);
      await conn2.query(
        `INSERT INTO QuizOptions (quiz_id, option_text, is_correct) VALUES ?`,
        [optionValues]
      );
    }

    // 3️⃣ Insert teacher's answer for short_answer / true_false
    if (quizData.question_type !== "multiple_choice" && quizData.answer_text) {
      await conn.query(
        `INSERT INTO QuizAnswers (quiz_id, short_answer) VALUES (?, ?)`,
        [quizId, quizData.answer_text]
      );
    }
 
    return quizId;
  } catch (err) { 
    throw err;
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
  addLessons,
  getLessonsByCourseService,
  deleteLesson,
  updateLesson,
  createQuiz,
  getQuizzesByLesson, 
};
