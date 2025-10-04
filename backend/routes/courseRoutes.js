const express = require("express");
const {
  getAllCourse,
  getCourseById,
  insertCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const router = express.Router();

//Get all Categories
router.get("/getall", getAllCourse);

//Get course category by ID
router.get("/get/:id", getCourseById);

//Insert new course category
router.post("/insert", insertCourse);

//Insert new course category
router.put("/update/:id", updateCourse);

//Delete course category
router.delete("/delete/:id", deleteCourse);

module.exports = router;
