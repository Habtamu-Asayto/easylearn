const express = require("express");
const {
  getAllEnrollments,
  getEnrollmentById,
  insertEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");
const router = express.Router();

//Get all Categories
router.get("/getall", getAllEnrollments);

//Get course category by ID
router.get("/get/:id", getEnrollmentById);

//Insert new course category
router.post("/insert", insertEnrollment);

//Insert new course category
router.put("/update/:id", updateEnrollment);

//Delete course category
router.delete("/delete/:id", deleteEnrollment);

module.exports = router;
