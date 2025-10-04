const express = require("express");
const {
  getAllProgress,
  getProgressById,
  insertProgress,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");
const router = express.Router();

//Get all Categories
router.get("/getall", getAllProgress);

//Get course category by ID
router.get("/get/:id", getProgressById);

//Insert new course category
router.post("/insert", insertProgress);

//Insert new course category
router.put("/update/:id", updateProgress);

//Delete course category
router.delete("/delete/:id", deleteProgress);

module.exports = router;
