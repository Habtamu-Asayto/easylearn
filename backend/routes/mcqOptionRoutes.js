const express = require("express");
const {
  getAllOptions,
  getOptionById,
  insertOptions,
  updateOption,
  deleteOption,
} = require("../controllers/mcqOptionController");
const router = express.Router();

//Get all users
router.get("/getall", getAllOptions);

//Get user by ID
router.get("/get/:id", getOptionById);

//Insert new User
router.post("/insert", insertOptions);

//Insert new User
router.put("/update/:id", updateOption);

//Delete User
router.delete("/delete/:id", deleteOption);

module.exports = router;
