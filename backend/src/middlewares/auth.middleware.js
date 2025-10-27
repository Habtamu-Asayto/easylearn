// Import the dotenv package
require("dotenv").config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend
// Import the employee service
const userService = require("../services/userService.js");

// A function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"]?.split(" ")[1];
  // console.log("Token received from frontend:", token);
  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!",
      });
    }

    req.user = decoded;
    next();
  });
};

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  // let token = req.headers["x-access-token"];
  const role = req.user.role_name;
  const user_email = req.user.user_email;
  const user = await userService.getUserByEmail(user_email);
  if (role === 1 || role === 2) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin!",
    });
  }
};
const forAll = async (req, res, next) => {
  const role = req.user.role_name;
  if (role === 1 || role === 2 || role === 3) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not privileged",
    });
  }
};
const isInstructor = async (req, res, next) => {
  const role = req.user.role_name;
  if (role === 2) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not Instructor",
    });
  }
};
const isStudent = async (req, res, next) => {
  const role = req.user.role_name;
  if (role === 3) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not student!",
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isStudent,
  isInstructor,
  forAll,
};

module.exports = authMiddleware;
