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
        // controller after create
        res
          .status(200)
          .json({
            status: "pending_verification",
            message: "Check your email",
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
  const userExists = await userService.checkIfUserExists(
    req.body.student_email
  );
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

async function verifyEmail(req, res) {
  const { email, token } = req.body;
  console.log("Try to verify...");
  try {
    const user = await userService.getUserByEmail(email);

    if (!user || user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const foundUser = user[0];

    if (foundUser.verification_token !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const now = new Date();
    if (new Date(foundUser.verification_token_expires) < now) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Mark user as verified
    const query = `UPDATE users SET is_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE user_email = ?`;
    await require("../config/db2").query(query, [email]);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res
      .status(500)
      .json({ message: "Server error during verification" });
  }
}

module.exports = {
  createUser,
  getAllStudents,
  createStudent,
  verifyEmail,
};
