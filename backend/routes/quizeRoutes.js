const express = require("express");
const {
  getAllQuizes,
  getQuizeById,
  insertQuizes,
  updateQuize,
  deleteQuize,
} = require("../controllers/quizeController");
const router = express.Router();

//Get all users
router.get("/getall", getAllQuizes);

//Get user by ID
router.get("/get/:id", getQuizeById);

//Insert new User
router.post("/insert", insertQuizes);

//Insert new User
router.put("/update/:id", updateQuize);

//Delete User
router.delete("/delete/:id", deleteQuize);

module.exports = router;
