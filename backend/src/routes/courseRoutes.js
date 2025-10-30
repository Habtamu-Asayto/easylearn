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
//Chapter Routes
router.post(
  "/add-chapter",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createChapters
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
  "/chapter/:courseId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.getChaptersByCourse
);
//Delete course category
router.delete(
  "/courses/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteCourse
);

//Delete course category
router.delete(
  "/chapter/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteChapter
);

// PUT /lessons/:lessonId
router.put(
  "/chapter/:chapterId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.updateChapter
);
router.post(
  "/add-quiz",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createQuiz
);

// Lesson Routes
router.post(
  "/add-lesson",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createLessons
);

router.get(
  "/lessons/:courseId/:chapterId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.getLessonsByChapter
);

router.get(
  "/progress/:courseId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.getCourseProgress
);
router.post(
  "/progress/lesson",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.completeLesson
);
 

router.delete(
  "/lesson/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteLesson
);

router.put(
  "/lesson/:lessonId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.updateLesson
);

router.get(
  "/quize/:chapterId",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  courseController.getQuizzesByChapter
);
module.exports = router;
