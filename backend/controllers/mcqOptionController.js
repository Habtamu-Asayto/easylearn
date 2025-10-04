const conn = require("../config/db");
// Get all users
const getAllOptions = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM mcqOption");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Options found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Options retrieved successfully",
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
const getOptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query(
      "SELECT * FROM mcqOption WHERE option_id = ?",
      [id]
    );
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Option found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Option fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Option by ID",
      error: error,
    });
  }
};

//Insert Question
const insertOptions = async (req, res) => {
  try {
    const { question_id, option_text} = req.body;
    if (!question_id || !option_text) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO mcqOption (question_id, option_text) VALUES (?, ?)",
      [question_id, option_text]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Option",
      });
    }
    res.status(201).json({
      success: true,
      message: "Option inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Option",
      error: error,
    });
  }
};
//Update Question
const updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM mcqOption WHERE option_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Option ID",
      });
    }
    const { question_id, option_text } = req.body;
    const data = await conn.query(
      "UPDATE mcqOption SET question_id = ?, option_text = ? WHERE option_id = ?",
      [question_id, option_text, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Option",
      });
    }
    res.status(200).json({
      success: true,
      message: "Option updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Option",
      error: error,
    });
  }
};

const deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM mcqOption WHERE option_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Option ID",
      });
    }
    const data = await conn.query("DELETE FROM mcqOption WHERE option_id = ?", [
      id,
    ]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Option",
      });
    }
    res.status(200).json({
      success: true,
      message: "Option deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Option",
      error: error,
    });
  }
};
module.exports = {
  getAllOptions,
  getOptionById,
  insertOptions,
  updateOption,
  deleteOption,
};

