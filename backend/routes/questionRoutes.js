const express = require("express");
const {
  getAllQuestions,
  getQuestionById,
  insertQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const router = express.Router();

//Get all users
router.get("/getall", getAllQuestions);

//Get user by ID
router.get("/get/:id", getQuestionById);

//Insert new User
router.post("/insert", insertQuestions);

//Insert new User
router.put("/update/:id", updateQuestion);

//Delete User
router.delete("/delete/:id", deleteQuestion);

module.exports = router;
