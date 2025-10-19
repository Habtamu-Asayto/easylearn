const express = require("express");
const {
  getAllLessons,
  getLessonById,
  insertLesson,
  updateLesson,
  deleteLesson
} = require("../controllers/lessonController");
const router = express.Router();

//Get all Categories
router.get("/getall", getAllLessons);

//Get course category by ID
router.get("/get/:id", getLessonById);

//Insert new course category
router.post("/insert", insertLesson);

//Insert new course category
router.put("/update/:id", updateLesson);

//Delete course category
router.delete("/delete/:id", deleteLesson);

module.exports = router;
