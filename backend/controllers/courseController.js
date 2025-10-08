//Import user service
const courseService = require("../services/courseService");
const db = require("../config/db");
//Create User
async function createCourse(req, res, next) {
  // check if token arives
  console.log(req.headers); 
  // Check if User email already exists in the database
  const courseExists = await courseService.checkIfCourseExists(
    req.body.title
  ); 
  // If user exists, send a response to the client
  if (courseExists) {
    res.status(400).json({
      error: "This category is created before!",
    }); 
  } else {
    try {
      const courseData = req.body;
      // Create the user
      const cour = await courseService.createCourse(courseData)
      if (!cour) {
        res.status(400).json({
          error: "Failed to add Course!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
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

module.exports = {
  createCourse, 
  getAllCoure
}