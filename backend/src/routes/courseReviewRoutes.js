const express = require("express");
const {
  getAllReviews,
  getReviewById,
  insertReview,
  updateReview,
  deleteReview,
} = require("../controllers/courseReviewController");
const router = express.Router();

//Get all Categoriesa
router.get("/getall", getAllReviews);

//Get course category by ID
router.get("/get/:id", getReviewById);

//Insert new course category
router.post("/insert", insertReview);

//Insert new course category
router.put("/update/:id", updateReview);

//Delete course category
router.delete("/delete/:id", deleteReview);

module.exports = router;
