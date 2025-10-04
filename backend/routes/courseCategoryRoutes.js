const express = require("express");
const {
  getAllCategory,
  getCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/courseCategoryController");
const router = express.Router();

//Get all Categories
router.get("/getall", getAllCategory);

//Get course category by ID
router.get("/get/:id", getCategoryById);

//Insert new course category
router.post("/insert", insertCategory);

//Insert new course category
router.put("/update/:id", updateCategory);

//Delete course category
router.delete("/delete/:id", deleteCategory);

module.exports = router;
