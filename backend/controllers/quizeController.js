const conn = require("../config/db");
// Get all users
const getAllQuizes = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Quiz");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Quizes found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Quizes retrieved successfully",
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
const getQuizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Quiz WHERE quiz_id = ?", [id]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Quize found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quize fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Quize by ID",
      error: error,
    });
  }
};

//Insert User
const insertQuizes = async (req, res) => {
  try {
    const { title, description, total_marks, created_by} = req.body;
    if (!title || !description || !total_marks || !created_by) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Quiz (title, description, total_marks, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [title, description, total_marks, created_by]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Quiz",
      });
    }
    res.status(201).json({
      success: true,
      message: "Quiz inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Quiz",
      error: error,
    });
  }
};
//Update User
const updateQuize = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Quiz WHERE quiz_id = ?", [id]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Quize ID",
      });
    }
    const { title, description, total_marks, created_by } = req.body;
    const data = await conn.query(
      "UPDATE Quiz SET title = ?, description = ?, total_marks = ?, created_by = ?, updated_at = NOW() WHERE quiz_id = ?",
      [title, description, total_marks, created_by, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Quize",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quize updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Quize",
      error: error,
    });
  }
};

const deleteQuize = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Quiz WHERE quiz_id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Quize ID",
      });
    }
    const data = await conn.query("DELETE FROM Quiz WHERE quiz_id = ?", [id]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Quize",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quize deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Quize",
      error: error,
    });
  }
};
module.exports = {
  getAllQuizes,
  getQuizeById,
  insertQuizes,
  updateQuize,
  deleteQuize,
};
