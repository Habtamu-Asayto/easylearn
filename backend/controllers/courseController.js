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

    // 2️⃣ Attach instructor from token
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

async function getAllCoure(req, res, next) {
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
  console.log("1st:", courseId);
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
module.exports = {
  createCourse,
  getAllCoure,
  updateCourse, 
  deleteCourse
};
