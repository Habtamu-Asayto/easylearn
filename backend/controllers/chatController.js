const conn = require("../config/db");
// Get all users
const getAllChat = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM chat");
    if (!data) {
      return res.status(404).json({ sucess: false, message: "No Chat found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Chat retrieved successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "Server Error",
    });
  }
};

//Get user by ID
const getChatById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM chat WHERE chat_id = ?", [id]);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No Chat found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Chat by ID",
      error: error,
    });
  }
};

//Insert User
const insertChat = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO chat (sender_id, receiver_id, message,created_at ) VALUES (?, ?, ?, NOW())",
      [sender_id, receiver_id, message]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Chat",
      });
    }
    res.status(201).json({
      success: true,
      message: "Chat inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Chat",
      error: error,
    });
  }
};
//Update User
const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const checkChat = await conn.query("SELECT * FROM chat WHERE chat_id=?", [
      id,
    ]);
    if (!id || checkChat[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Chat ID",
      });
    }
    const { sender_id, receiver_id, message } = req.body;
    const data = await conn.query(
      "UPDATE chat SET sender_id = ?, receiver_id = ?, message = ?, created_at = NOW() WHERE chat_id = ?",
      [sender_id, receiver_id, message, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Chat",
      });
    }
    res.status(200).json({
      success: true,
      message: "Chat updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Chat",
      error,
    });
  }
};
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM chat WHERE chat_id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Chat ID",
      });
    }
    const data = await conn.query("DELETE FROM chat WHERE chat_id = ?", [id]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Chat",
      });
    }
    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Chat",
      error: error,
    });
  }
};
module.exports = {
  getAllChat,
  getChatById,
  insertChat,
  updateChat,
  deleteChat,
};
