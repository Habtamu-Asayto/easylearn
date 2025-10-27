// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const courseController = require("../controllers/courseController");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");

// we can restrict on both back and front end

//User Routes
router.post(
  "/add-course",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createCourse
);

//User Routes
router.post(
  "/add-overview",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createOverview
);
//Lesson Routes
router.post(
  "/add-lesson",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createLessons
);

router.put(
  "/add-overview",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.updateOverview
);

//Update Routes
router.put(
  "/add-course/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.updateCourse
);

router.get(
  "/courses",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.getAllCourse
);

router.get(
  "/lessons/:courseId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.getLessonsByCourse
);
//Delete course category
router.delete(
  "/courses/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteCourse
);

//Delete course category
router.delete(
  "/lesson/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteLesson
);

// PUT /lessons/:lessonId
router.put(
  "/lesson/:lessonId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.updateLesson
);
router.post(
  "/add-quiz",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createQuiz
);

module.exports = router;
