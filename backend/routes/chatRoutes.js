const express = require("express");
const {
  getAllChat,
  getChatById,
  insertChat,
  updateChat,
  deleteChat
} = require("../controllers/chatController");
const router = express.Router();

//Get all users
router.get("/getallchat", getAllChat);

//Get user by ID
router.get("/get/:id", getChatById);

//Insert new User
router.post("/insert", insertChat);

//Insert new User
router.put("/update/:id", updateChat);

//Delete User
router.delete("/delete/:id", deleteChat);

module.exports = router;
