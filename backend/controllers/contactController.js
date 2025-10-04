const conn = require("../config/db");
// Get all users
const getAllContact = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Contact");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Contact found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Contacts retrieved successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "Server Error",
    });
  }
};

//Get Question by ID
const getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query(
      "SELECT * FROM Contact WHERE contact_id = ?",
      [id]
    );
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Contact found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Contact by ID",
      error: error,
    });
  }
};

//Insert Question
const insertContact = async (req, res) => {
  try {
    const { user_id, name, email, subject, message } = req.body;
    if (!user_id || !name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Contact ( user_id, name, email, subject, message,created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [user_id, name, email, subject, message]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Contact",
      });
    }
    res.status(201).json({
      success: true,
      message: "Contact inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Contact",
      error: error,
    });
  }
};
//Update Question
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Contact WHERE contact_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Contact ID",
      });
    }
    const { user_id, name, email, subject, message } = req.body;
    const data = await conn.query(
      "UPDATE Contact SET user_id = ?, name = ?, email = ?, subject = ?, message = ?, updated_at = NOW() WHERE contact_id = ?",
      [user_id, name, email, subject, message, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Contact",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Contact",
      error: error,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Contact WHERE contact_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Contact ID",
      });
    }
    const data = await conn.query("DELETE FROM Contact WHERE contact_id = ?", [
      id,
    ]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Contact",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Contact",
      error: error,
    });
  }
};
module.exports = {
  getAllContact,
  getContactById,
  insertContact,
  updateContact,
  deleteContact,
};
