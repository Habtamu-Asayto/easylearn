// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const userController = require("../controllers/userController");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");


// we can restrict on both back and front end
//User Routes
router.post("/user", userController.createUser);
<<<<<<< HEAD
router.post("/verify-email", userController.verifyEmail);
router.get( 
=======
router.get(
>>>>>>> a90b863adf9f2fc29aac777925311dbe31558158
  "/students",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.getAllStudents
);
router.post(
  "/add-student",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.createStudent
);

// Export the router
module.exports = router;
