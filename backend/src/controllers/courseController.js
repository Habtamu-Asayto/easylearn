// controllers/courseController.js
const courseService = require("../services/courseService");
async function createCourse(req, res) {
  try {
    //Check if duplicate course exists
    const courseExists = await courseService.checkIfCourseExists(
      req.body.title
    );
    if (courseExists) {
      return res.status(400).json({
        status: false,
        error: "A course with this title already exists.",
      });
    }

    // Attach instructor from token
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ status: false, error: "Unauthorized" });
    }

    const courseData = {
      ...req.body,
      instructor_id: req.user.user_id,
    };

    // Create the course
    const inserted = await courseService.createCourse(courseData);
    if (!inserted) {
      return res.status(400).json({
        status: false,
        error: "Failed to add Course!",
      });
    }

    console.log("Course added successfully!");
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      status: false,
      error: "Something went wrong while adding the course.",
    });
  }
}

async function createChapters(req, res) {
  try {
    const chapters = req.body;
    console.log("Received chapters:", chapters);

    if (!chapters || chapters.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "No chapters provided" });
    }

    const result = await courseService.addChapters(chapters);
    console.log("Affected rows:", result.affectedRows);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ status: true, message: "Chapters added successfully!" });
    } else {
      return res
        .status(400)
        .json({ status: false, error: "No chapters inserted." });
    }
  } catch (err) {
    console.error("Error adding chapters:", err);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
}

async function createOverview(req, res) {
  try {
    // console.log("Received body:", req.body); // <-- debug incoming data

    const { course_id, detail, skill, duration, certificate } = req.body;

    // Validate required fields
    if (!course_id) {
      return res.status(400).json({
        status: false,
        error: "course_id is required",
      });
    }

    // Fallback overview to null if undefined
    const courseData = {
      course_id: course_id ?? null, // use null if undefined
      overview_detail: detail ?? null,
      required_skill: skill ?? null,
      duration: duration ?? null,
      certificate: certificate ?? null,
    };

    // Create the course overview
    const inserted = await courseService.createOverview(courseData);

    if (!inserted) {
      return res.status(400).json({
        status: false,
        error: "Failed to add Course Overview!",
      });
    }

    console.log("Overview added successfully!");
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    console.error("Error creating overview:", error);
    return res.status(500).json({
      status: false,
      error: "Something went wrong while adding the course.",
    });
  }
}

async function updateOverview(req, res) {
  try {
    // console.log("Received body:", req.body); // <-- debug incoming data

    const { course_id, detail, skill, duration, certificate } = req.body;

    // Validate required fields
    if (!course_id) {
      return res.status(400).json({
        status: false,
        error: "course_id is required",
      });
    }

    // Fallback overview to null if undefined
    const courseData = {
      course_id: course_id ?? null, // use null if undefined
      overview_detail: detail ?? null,
      required_skill: skill ?? null,
      duration: duration ?? null,
      certificate: certificate ?? null,
    };

    // Create the course overview
    const inserted = await courseService.updateOverview(courseData);

    if (!inserted) {
      return res.status(400).json({
        status: false,
        error: "Failed to add Course Overview!",
      });
    }

    console.log("Overview updated successfully!");
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    console.error("Error updating overview:", error);
    return res.status(500).json({
      status: false,
      error: "Something went wrong while adding the overvieww.",
    });
  }
}

async function updateCourse(req, res, next) {
  try {
    const courseData = req.body;
    const courseId = req.params.id;

    if (!req.user || !req.user.user_id) {
      console.log("instructor_id is undefined");

      return res.status(401).json({ error: "Unauthorized" });
    }

    courseData.instructor_id = req.user.user_id;

    const updated = await courseService.updateCourse(courseId, courseData);
    if (!updated) {
      return res.status(400).json({ error: "Failed to update course!" });
    }

    res
      .status(200)
      .json({ status: true, message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function getAllCourse(req, res, next) {
  const course = await courseService.getAllCourse();
  if (!course) {
    res.status(400).json({
      error: "Failed to get all courses!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: course,
    });
  }
}

async function deleteCourse(req, res) {
  const courseId = req.params.id;
  if (!courseId) {
    return res
      .status(400)
      .json({ status: false, error: "Course ID is required" });
  }
  try {
    const deleted = await courseService.deleteCourse(courseId);

    if (deleted) {
      return res
        .status(200)
        .json({ status: true, message: "Course deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ status: false, error: "Course not found or already deleted" });
    }
  } catch (err) {
    console.error("Controller error:", err);
    return res
      .status(500)
      .json({ status: false, error: "Something went wrong" });
  }
}

async function deleteChapter(req, res) {
  const chapterId = req.params.id;
  if (!chapterId) {
    return res
      .status(400)
      .json({ status: false, error: "Chapter ID is required" });
  }
  try {
    const deleted = await courseService.deleteChapter(chapterId);

    if (deleted) {
      return res
        .status(200)
        .json({ status: true, message: "Chapter deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ status: false, error: "Chapter not found or already deleted" });
    }
  } catch (err) {
    console.error("Controller error:", err);
    return res
      .status(500)
      .json({ status: false, error: "Something went wrong" });
  }
}

const getChaptersByCourse = async (req, res) => {
  const { courseId } = req.params;
  //  console.log("Fetching lessons  id", courseId);
  try {
    const chapters = await courseService.getChaptersByCourseService(courseId);

    res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chapters",
      error: error.message,
    });
  }
};

const updateChapter = async (req, res) => {
  const { chapterId } = req.params;
  const chapterData = req.body;

  try {
    const result = await courseService.updateChapter(chapterId, chapterData);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Chapter updated successfully" });
  } catch (error) {
    console.error("Error updating Chapter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Chapter",
      error: error.message,
    });
  }
};

async function createQuiz(req, res) {
  try {
    const {
      chapter_id,
      question,
      question_type,
      points,
      options,
      answer_text,
    } = req.body;

    if (!chapter_id) {
      return res
        .status(400)
        .json({ status: false, error: "Chapter id is required" });
    }
    // const existingQuizzes = await courseService.getQuizzesByLesson(lesson_id);
    // if (existingQuizzes.length > 0) {
    //   return res.status(400).json({
    //     status: false,
    //     error: "A quiz already exists for this lesson.",
    //   });
    // }

    const QuizData = {
      chapter_id,
      question,
      question_type,
      points,
      options, // pass full array
      answer_text,
    };
    // Create the course overview
    const inserted = await courseService.createQuiz(QuizData);

    if (!inserted) {
      return res.status(400).json({
        status: false,
        error: "Failed to add Quize!",
      });
    }

    console.log("Quize added successfully!");
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    console.error("Error creating Quize:", error);
    return res.status(500).json({
      status: false,
      error: "Something went wrong while adding the Quize.",
    });
  }
}

// Lesson

async function createLessons(req, res) {
  try {
    const lessons = req.body;
    console.log("Received lessons:", lessons);

    if (!lessons || lessons.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "No lessons provided" });
    }
    // Validate each lesson
    for (const lesson of lessons) {
      if (
        !lesson.title ||
        !lesson.content ||
        !lesson.chapter_id ||
        !lesson.course_id
      ) {
        return res.status(400).json({
          status: false,
          message:
            "Missing required fields: title, content, chapter_id, and course_id are required.",
        });
      }

      if (lesson.video_url && !/^https?:\/\/.+/.test(lesson.video_url)) {
        return res.status(400).json({
          status: false,
          message:
            "Video URL must be a valid link starting with http or https.",
        });
      }
    }
    const insertedLessons = await courseService.addLessons(lessons);
    console.log("Inserted lessons:", insertedLessons);

    return res.status(200).json({
      status: true,
      message: "Lessons added successfully!",
      data: insertedLessons, // <-- send back lessons with IDs
    });
  } catch (err) {
    console.error("Error adding lessons:", err);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
}

async function deleteLesson(req, res) {
  const lessonId = req.params.id;
  if (!lessonId) {
    return res
      .status(400)
      .json({ status: false, error: "Lesson ID is required" });
  }
  try {
    const deleted = await courseService.deleteLesson(lessonId);

    if (deleted) {
      return res
        .status(200)
        .json({ status: true, message: "Lesson deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ status: false, error: "Lesson not found or already deleted" });
    }
  } catch (err) {
    console.error("Controller error:", err);
    return res
      .status(500)
      .json({ status: false, error: "Something went wrong" });
  }
}

// Controller
const getLessonsByChapter = async (req, res) => {
  const { courseId, chapterId } = req.params; // capture both

  try {
    const lessons = await courseService.getLessonsByChapterService(
      courseId,
      chapterId
    );

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error("Error fetching lessons by chapter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons by chapter",
      error: error.message,
    });
  }
};

const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const lessonData = req.body;

  try {
    const result = await courseService.updateLesson(lessonId, lessonData);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Lesson updated successfully" });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson",
      error: error.message,
    });
  }
};

const getQuizzesByChapter = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const quizzes = await courseService.getQuizesByChapter(chapterId);
    res.status(200).json({ status: true, data: quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: "Failed to fetch quizzes" });
  }
};

const getOptionsByQuiz = async (req, res) => {
  const { quizId } = req.params;
  try {
    const options = await courseService.getOptionsByQuiz(quizId);
    res.status(200).json({ status: true, data: options });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: "Failed to fetch options" });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.user_id; // from authMiddleware

    const { courseId } = req.params;

    const progress = await courseService.fetchCourseProgress(userId, courseId);
    res.json(progress);
  } catch (err) {
    console.error("Error fetching course progress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const completeLesson = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { courseId, lessonId } = req.body;

    await courseService.markLessonCompleted(userId, lessonId);
    const progress = await courseService.fetchCourseProgress(userId, courseId);

    res.json(progress);
  } catch (err) {
    console.error("Error completing lesson:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveQuizAnswer = async (req, res) => {
  const { quiz_id, user_id, selected_option_id, is_correct } = req.body;

  if (!quiz_id || !user_id) {
    return res.status(400).json({
      status: false,
      message: "Missing required fields",
    });
  }

  try {
    const result = await courseService.saveQuizAnswerService(
      quiz_id,
      user_id,
      selected_option_id,
      is_correct
    );

    if (result.success) {
      return res.status(200).json({
        status: true,
        message: "Answer saved successfully",
        data: { answer_id: result.insertId },
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to save quiz answer",
      });
    }
  } catch (error) {
    console.error("Error in quiz.controller.js > saveQuizAnswer:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const enrollCourse = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user?.user_id;
  console.log("Are you delivered here ");
  console.log("User-ID ", user_id, " & ", course_id);
  if (!user_id || !course_id) {
    return res
      .status(400)
      .json({ status: false, message: "Missing required fields" });
  }

  try {
    const result = await courseService.enrollCourseService(user_id, course_id);

    if (!result.success) {
      return res.status(400).json({ status: false, message: result.message });
    }

    return res.status(200).json({
      status: true,
      message: "Enrolled successfully",
      data: { enrollment_id: result.enrollment_id },
    });
  } catch (error) {
    console.error("Error enrolling user:", error);
    res.status(500).json({
      status: false,
      message: "Failed to enroll in course",
      error: error.message,
    });
  }
};

const checkEnrollmentStatus = async (req, res) => {
  const { course_id } = req.params;
  const user_id = req.user?.user_id;

  if (!user_id || !course_id) {
    return res
      .status(400)
      .json({ status: false, message: "Missing required fields" });
  }

  try {
    const result = await courseService.checkEnrollmentStatusService(
      user_id,
      course_id
    );

    return res.status(200).json({
      status: true,
      enrolled: result.enrolled,
    });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({
      status: false,
      message: "Failed to check enrollment",
      error: error.message,
    });
  }
};
module.exports = {
  createCourse,
  getAllCourse,
  updateCourse,
  deleteCourse,
  createOverview,
  updateOverview,
  createChapters,
  getChaptersByCourse,
  deleteChapter,
  updateChapter,
  createQuiz,
  createLessons,
  getLessonsByChapter,
  deleteLesson,
  updateLesson,
  getQuizzesByChapter,
  getCourseProgress,
  completeLesson,
  getOptionsByQuiz,
  saveQuizAnswer,
  enrollCourse,
  checkEnrollmentStatus,
};
