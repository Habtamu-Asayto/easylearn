// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const userController = require("../controllers/userController");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");

// File upload config(Profile Image)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where files are saved
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // unique filename
    );
  },
});
const upload = multer({ storage });

router.get(
  "/users/profile",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  userController.getUserProfile
);
router.put(
  "/users/profile",
  authMiddleware.verifyToken,
  upload.single("profile_img"),
  userController.updateUserProfile
);
// we can restrict on both back and front end
//User Routes
router.post("/user", userController.createUser);
router.post("/verify-email", userController.verifyEmail);
router.get(
  "/students",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.getAllStudents
);
router.post(
  "/add-student",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.createStudent
);

router.get(
  "/instructor/:courseId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  userController.getCourseInstructor
);
router.get(
  "/instructors/:instructorId/courses",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.getAllCoursesofInstructor
);

router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
// Export the router
module.exports = router;
