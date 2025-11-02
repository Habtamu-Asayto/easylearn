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

const updateChapter = async (chapterId, chapterData) => {
  const { title, description } = chapterData;

  const [result] = await conn2.query(
    `UPDATE chapters 
     SET title = ?, description = ?,  updated_at = NOW() 
     WHERE chapter_id = ?`,
    [title, description, chapterId]
  );

  return result;
};

// Get all courses
async function getAllCourse() {
  const query = `
    SELECT 
  c.course_id,
  c.title AS course_title,
  c.description AS course_description,
  c.category_id,
  ui.user_full_name AS instructor_name,
  c.created_at AS course_created_at,
  c.updated_at AS course_updated_at,

  co.overview_id,
  co.overview_detail,
  co.required_skill,
  co.duration,
  co.certificate,
  co.created_at AS overview_created_at,
  co.updated_at AS overview_updated_at,

  ch.chapter_id,
  ch.title AS chapter_title,
  ch.description AS chapter_description,
  ch.color AS chapter_color,
  ch.chapter_order,
  ch.created_at AS chapter_created_at,
  ch.updated_at AS chapter_updated_at,

  le.lesson_id,
  le.title AS lesson_title,
  le.content AS lesson_content,
  le.video_url,
  le.duration AS lesson_duration,
  le.created_at AS lesson_created_at,
  le.updated_at AS lesson_updated_at

FROM courses c
LEFT JOIN user_info ui ON c.instructor_id = ui.user_id
LEFT JOIN course_overview co ON c.course_id = co.course_id
LEFT JOIN chapters ch ON c.course_id = ch.course_id
LEFT JOIN lessons le ON ch.chapter_id = le.chapter_id
ORDER BY c.course_id, ch.chapter_order, le.lesson_order;

  `;

  const rows = await conn.query(query);

  const courses = [];
  const courseMap = new Map();

  rows.forEach((row) => {
    // 1️⃣ Course level
    if (!courseMap.has(row.course_id)) {
      courseMap.set(row.course_id, {
        course_id: row.course_id,
        title: row.course_title,
        description: row.course_description,
        category_id: row.category_id,
        instructor_name: row.instructor_name,
        created_at: row.course_created_at,
        updated_at: row.course_updated_at,
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
          : null,
        chapters: [],
      });
      courses.push(courseMap.get(row.course_id));
    }

    const course = courseMap.get(row.course_id);

    // 2️⃣ Chapter level
    if (row.chapter_id) {
      let chapter = course.chapters.find(
        (ch) => ch.chapter_id === row.chapter_id
      );
      if (!chapter) {
        chapter = {
          chapter_id: row.chapter_id,
          title: row.chapter_title,
          description: row.chapter_description,
          color: row.chapter_color,
          chapter_order: row.chapter_order,
          created_at: row.chapter_created_at,
          updated_at: row.chapter_updated_at,
          lessons: [],
        };
        course.chapters.push(chapter);
      }

      // 3️⃣ Lesson level
      if (row.lesson_id) {
        chapter.lessons.push({
          lesson_id: row.lesson_id,
          title: row.lesson_title,
          content: row.lesson_content,
          video_url: row.video_url,
          duration: row.lesson_duration,
          created_at: row.lesson_created_at,
          updated_at: row.lesson_updated_at,
        });
      }
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
    await conn.query("DELETE FROM chapters WHERE course_id = ?", [courseId]);
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

async function deleteChapter(chapterId) {
  if (!chapterId) throw new Error("Chapter ID is required");

  try {
    // Delete the main course
    const result = await conn.query(
      "DELETE FROM chapters WHERE chapter_id = ?",
      [chapterId]
    );

    // Return true only if main course deleted
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Delete chapter error:", err);
    throw err;
  }
}

async function addChapters(chapters) {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new Error("No chapter provided");
  }

  try {
    const placeholders = chapters.map(() => "(?,?,?)").join(",");
    const values = [];

    chapters.forEach((c) => {
      values.push(c.course_id, c.chapter_title, c.chapter_description);
    });

    const query = `
      INSERT INTO chapters (course_id, title, description)
      VALUES ${placeholders}
    `;

    // now conn.query returns [rows, fields]
    const [result] = await conn2.query(query, values);
    console.log("Insert result:", result);
    return result;
  } catch (err) {
    console.error("Add chapter error:", err);
    throw err;
  }
}

const getChaptersByCourseService = async (courseId) => {
  const [rows] = await conn2.query(
    `SELECT * FROM chapters WHERE course_id = ?;`,
    [courseId]
  );
  return rows;
};

// Check if a quiz exists for a lesson
async function getQuizzesByChapter(chapterId) {
  try {
    const [rows] = await conn2.query(
      `SELECT quiz_id FROM Quiz WHERE chapter_id = ?`,
      [chapterId]
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
      `INSERT INTO Quiz (question, question_type, points, chapter_id) VALUES (?, ?, ?, ?)`,
      [
        quizData.question,
        quizData.question_type,
        quizData.points,
        quizData.chapter_id,
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

    // Insert teacher's answer for short_answer / true_false
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

// Lesson functions
const updateLesson = async (lessonId, lessonData) => {
  const { title, content, video_url, duration } = lessonData;

  const [result] = await conn2.query(
    `UPDATE lessons 
     SET title = ?, content = ?, duration=?, video_url = ?, updated_at = NOW() 
     WHERE lesson_id = ?`,
    [title, content, duration, video_url, lessonId]
  );

  return result;
};
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
    console.error("Delete lesson error:", err);
    throw err;
  }
}

async function addLessons(lessons) {
  if (!Array.isArray(lessons) || lessons.length === 0) {
    throw new Error("No lessons provided");
  }

  try {
    const placeholders = lessons.map(() => "(?,?,?,?,?,?)").join(",");
    const values = [];

    lessons.forEach((l) => {
      values.push(
        l.course_id,
        l.chapter_id,
        l.title,
        l.duration || null,
        l.content,
        l.video_url || null
      );
    });

    const query = `
      INSERT INTO lessons (course_id, chapter_id, title,duration, content, video_url)
      VALUES ${placeholders}
    `;

    const [result] = await conn2.query(query, values);

    // Map the inserted IDs to lessons
    const insertedLessons = lessons.map((l, index) => ({
      lesson_id: result.insertId + index,
      ...l,
    }));

    return insertedLessons; // return array with IDs included
  } catch (err) {
    console.error("Add lesson error:", err);
    throw err;
  }
}

// Service
const getLessonsByChapterService = async (courseId, chapterId) => {
  const [rows] = await conn2.query(
    `SELECT * FROM lessons WHERE course_id = ? AND chapter_id = ?;`,
    [courseId, chapterId]
  );

  return rows;
};
const getQuizesByChapter = async (chapterId) => {
  const query = `
    SELECT q.quiz_id, q.question, q.question_type, COUNT(o.option_id) as total_questions
    FROM quiz q
    LEFT JOIN QuizOptions o ON q.quiz_id = o.quiz_id
    WHERE q.chapter_id = ?
    GROUP BY q.quiz_id
  `;

  const [rows] = await conn2.execute(query, [chapterId]);
  return rows;
};

const getOptionsByQuiz = async (quizId) => {
  const query = `
    SELECT *
    FROM QuizOptions
    WHERE quiz_id = ?
  `;
  const [rows] = await conn2.execute(query, [quizId]);
  console.log("Options fetched from DB:", rows);
  return rows;
};
const markLessonCompleted = async (userId, lessonId) => {
  await conn2.query(
    `INSERT INTO LessonProgress (user_id, lesson_id, completed, completed_at)
     VALUES (?, ?, 1, NOW())
     ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
    [userId, lessonId]
  );
};

const fetchCourseProgress = async (userId, courseId) => {
  const [totalResult] = await conn2.query(
    `SELECT COUNT(*) AS total FROM Lessons WHERE course_id = ?`,
    [courseId]
  );
  const total = totalResult[0].total;

  const [completedResult] = await conn2.query(
    `SELECT COUNT(*) AS completed
     FROM LessonProgress
     JOIN Lessons ON LessonProgress.lesson_id = Lessons.lesson_id
     WHERE LessonProgress.user_id = ? AND Lessons.course_id = ? AND completed = 1`,
    [userId, courseId]
  );
  const completed = completedResult[0].completed;

  return { total, completed };
};

const saveQuizAnswerService = async (
  quiz_id,
  user_id,
  selected_option_id,
  is_correct
) => {
  try {
    const query = `
      INSERT INTO QuizAnswers (quiz_id, user_id, selected_option_id, is_correct)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await conn2.execute(query, [
      quiz_id,
      user_id,
      selected_option_id || null,
      is_correct,
    ]);

    return { success: true, insertId: result.insertId };
  } catch (error) {
    console.error("Error in quiz.service.js > saveQuizAnswerService:", error);
    throw error;
  }
};

const enrollCourseService = async (user_id, course_id) => {
  try {
    // Check if user exists
    const [user] = await conn2.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );
    if (user.length === 0) throw new Error("User does not exist");

    // Check if course exists
    const [course] = await conn2.execute(
      "SELECT * FROM courses WHERE course_id = ?",
      [course_id]
    );
    if (course.length === 0) throw new Error("Course does not exist");

    // Check if already enrolled
    const [existing] = await conn2.execute(
      "SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?",
      [user_id, course_id]
    );
    if (existing.length > 0) {
      return {
        success: false,
        message: "User already enrolled in this course",
      };
    }

    // Insert enrollment
    const [result] = await conn2.execute(
      "INSERT INTO Enrollments (user_id, course_id) VALUES (?, ?)",
      [user_id, course_id]
    );

    return { success: true, enrollment_id: result.insertId };
  } catch (error) {
    console.error("Error in enrollCourseService:", error);
    throw error;
  }
};

const checkEnrollmentStatusService = async (user_id, course_id) => {
  try {
    const [rows] = await conn2.execute(
      `SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?`,
      [user_id, course_id]
    );

    const enrolled = rows.length > 0;
    return { success: true, enrolled };
  } catch (error) {
    console.error("Error in checkEnrollmentStatusService:", error);
    throw error;
  }
};
module.exports = {
  createCourse,
  checkIfCourseExists,
  getAllCourse,
  updateCourse,
  deleteCourse,
  createOverview,
  updateOverview,
  addChapters,
  getChaptersByCourseService,
  deleteChapter,
  updateChapter,
  createQuiz,
  getQuizesByChapter,
  addLessons,
  getLessonsByChapterService,
  deleteLesson,
  updateLesson,
  fetchCourseProgress,
  markLessonCompleted,
  getOptionsByQuiz,
  saveQuizAnswerService,
  enrollCourseService,
  checkEnrollmentStatusService,
};
