//Import user service
const userService = require("../services/userService");

//Create User
async function createUser(req, res, next) {
  // check if token arives
  console.log(req.headers);
  // Check if User email already exists in the database
  const userExists = await userService.checkIfUserExists(req.body.user_email);
  // If user exists, send a response to the client
  if (userExists) {
    res.status(400).json({
      error: "This email address is already associated with another user!",
    });
  } else {
    try {
      const userData = req.body;
      // Create the user
      const user = await userService.createUser(userData);
      if (!user) {
        res.status(400).json({
          error: "Failed to add the User!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}
//Create Student
async function createStudent(req, res, next) {
  // check if token arives
  console.log(req.headers);
  // Check if User email already exists in the database
  const userExists = await userService.checkIfUserExists(req.body.student_email);
  // If user exists, send a response to the client
  if (userExists) {
    res.status(400).json({
      error: "This email address is already associated with another user!",
    });
  } else {
    try {
      const userData = req.body;
      // Create the user
      const user = await userService.createStudent(userData);
      if (!user) {
        res.status(400).json({
          error: "Failed to add the User!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}
// Create the getAllStudents controller 
async function getAllStudents(req, res, next) {
  // Call the getAllStudents method from the user service
  const students = await userService.getAllStudents();
  console.log("students");
  if (!students) {
    res.status(400).json({
      error: "Failed to get all students!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: students,
    });
  }
}
module.exports = {
  createUser,
  getAllStudents,
  createStudent
};
