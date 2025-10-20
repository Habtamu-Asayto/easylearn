const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/contacts", chatController.getContacts);
router.get("/messages/:contactId", chatController.getMessages);
router.post("/messages",[authMiddleware.verifyToken, authMiddleware.isAdmin], chatController.sendMessage);

module.exports = router;
 