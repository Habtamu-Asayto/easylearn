const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/auth.middleware");


//  Allow all verified users to send and get messages
router.get("/contacts", chatController.getContacts);
router.get(
  "/messages/:contactId",
  authMiddleware.verifyToken,
  chatController.getMessages
);
router.get(
  "/unread-count/:userId",
  authMiddleware.verifyToken,
  chatController.getUnreadCount
);

router.post(
  "/messages",
  authMiddleware.verifyToken,
  chatController.sendMessage
);

module.exports = router;
