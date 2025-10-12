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
async function createLessons(req, res) {
  try {
    const lessons = req.body;
    console.log("Received lessons:", lessons);

    if (!lessons || lessons.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "No lessons provided" });
    }

    const result = await courseService.addLessons(lessons);
    console.log("Affected rows:", result.affectedRows);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ status: true, message: "Lessons added successfully!" });
    } else {
      return res
        .status(400)
        .json({ status: false, error: "No lessons inserted." });
    }
  } catch (err) {
    console.error("Error adding lessons:", err);
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

const getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;
  //  console.log("Fetching lessons  id", courseId);
  try {
    const lessons = await courseService.getLessonsByCourseService(courseId);

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
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

async function createQuiz(req, res) {
  try {
    const { lesson_id, question, question_type, points, options, answer_text } =
      req.body;

    if (!lesson_id) {
      return res
        .status(400)
        .json({ status: false, error: "Lesson id is required" });
    }
     const existingQuizzes = await courseService.getQuizzesByLesson(lesson_id);
     if (existingQuizzes.length > 0) {
       return res
         .status(400)
         .json({
           status: false,
           error: "A quiz already exists for this lesson.",
         });
     }

    const QuizData = {
      lesson_id,
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
module.exports = {
  createCourse,
  getAllCourse,
  updateCourse,
  deleteCourse,
  createOverview,
  updateOverview,
  createLessons,
  getLessonsByCourse,
  deleteLesson,
  updateLesson,
  createQuiz,
};
