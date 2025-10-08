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
  "/api/add-course",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.createCourse
);
//Update Routes
router.put(
  "/api/add-course/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.updateCourse
);

router.get(
  "/api/courses",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.getAllCoure
);

//Delete course category
 

router.delete(
  "/api/courses/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  courseController.deleteCourse
);


 
module.exports = router;
