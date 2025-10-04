const conn = require("../config/db");
// Get all users
const getAllQuestions = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Question");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Questions found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Questions retrieved successfully",
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
const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Question WHERE question_id = ?", [
      id,
    ]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Question found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Question by ID",
      error: error,
    });
  }
};

//Insert Question
const insertQuestions = async (req, res) => {
  try {
    const { quiz_id, question_text, question_type, marks } = req.body;
    if (!quiz_id || !question_text || !question_type || !marks) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Question (quiz_id, question_text, question_type, marks, created_at) VALUES (?, ?, ?, ?, NOW())",
      [quiz_id, question_text, question_type, marks]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Question",
      });
    }
    res.status(201).json({
      success: true,
      message: "Question inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Question",
      error: error,
    });
  }
};
//Update Question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Question WHERE question_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Question ID",
      });
    }
 const { quiz_id, question_text, question_type, marks } = req.body;
    const data = await conn.query(
      "UPDATE Question SET quiz_id = ?, question_text = ?, question_type = ?, marks = ?, created_at = NOW() WHERE question_id = ?",
      [quiz_id, question_text, question_type, marks, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Question",
      });
    }
    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Question",
      error: error,
    });
  }
};

const deleteQuestion= async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Question WHERE question_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Quize ID",
      });
    }
    const data = await conn.query(
      "DELETE FROM Question WHERE question_id = ?",
      [id]
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Question",
      });
    }
    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Question",
      error: error,
    });
  }
};
module.exports = {
  getAllQuestions,
  getQuestionById,
  insertQuestions,
  updateQuestion,
  deleteQuestion,
};
``