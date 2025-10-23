const chatService = require("../services/chatService");

exports.getContacts = async (req, res) => {
  const contacts = await chatService.getContacts();
  res.json(contacts);
};

exports.getMessages = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.user_id;
  const messages = await chatService.getMessages(userId, contactId);
  res.json(messages);
};
exports.getUnreadCount = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const totalUnread = await chatService.getTotalUnread(userId);
    return res.json({ totalUnread });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

exports.markAsRead = async (req, res) => {
  const receiverId = req.user.user_id;
  const { senderId } = req.params;
  console.log("Welcome===", senderId);
  

  try {
    await chatService.markMessagesAsRead(senderId, receiverId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to mark messages as read" });
  }
};


exports.sendMessage = async (req, res) => { 
  const { to, message } = req.body;
  const senderId = req.user.user_id; 

  await chatService.saveMessage(senderId, to, message);
  res.status(201).json({ success: true, from: senderId, to, message });
};
