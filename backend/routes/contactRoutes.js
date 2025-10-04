const express = require("express");
const {
  getAllContact,
  getContactById,
  insertContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const router = express.Router();

//Get all users
router.get("/getall", getAllContact);

//Get user by ID
router.get("/get/:id", getContactById);

//Insert new User
router.post("/insert", insertContact);

//Insert new User
router.put("/update/:id", updateContact);

//Delete User
router.delete("/delete/:id", deleteContact);

module.exports = router;
