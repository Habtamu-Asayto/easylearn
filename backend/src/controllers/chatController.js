const chatService = require("../services/chatService");

exports.getContacts = async (req, res) => {
  const contacts = await chatService.getContacts();
  res.json(contacts);
};

exports.getMessages = async (req, res) => {
  const { contactId } = req.params;
  const messages = await chatService.getMessages(contactId);
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { to, message } = req.body;
  const senderId = req.user.user_id; // assume authentication middleware
  console.log("Sender  : ", senderId);
  
  await chatService.saveMessage(senderId, to, message);
  res.status(201).json({ success: true });
};
