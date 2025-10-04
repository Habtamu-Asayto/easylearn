const conn = require("../config/db");
// Get all users
const getAllAnswers = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM UserAnswer");
    if (!data) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Answer found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Answer retrieved successfully",
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
const getAnswersById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query(
      "SELECT * FROM UserAnswer WHERE answer_id = ?",
      [id]
    );
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No Answer found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Answer fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Answer by ID",
      error: error,
    });
  }
}; 

//Insert User
const insertAnswers = async (req, res) => {
  try {
    const { user_id, question_id, selected_option_id, answer_text } =
      req.body;
    if (
      !user_id ||
      !question_id ||
      !selected_option_id ||
      !answer_text 
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO UserAnswer (user_id, question_id, selected_option_id, answer_text) VALUES (?,?, ?, ?)",
      [user_id, question_id, selected_option_id, answer_text]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Answer",
      });
    }
    res.status(201).json({
      success: true,
      message: "Answer inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Answer",
      error: error,
    });
  }
};
//Update User
const updateAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM UserAnswer WHERE answer_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Answer ID",
      });
    }
    const { question_id, selected_option_id, answer_text } = req.body;

    const data = await conn.query(
      "UPDATE UserAnswer SET question_id = ?, selected_option_id = ?, answer_text = ?, submitted_at = NOW() WHERE answer_id = ?",
      [question_id, selected_option_id, answer_text,id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Answer",
      });
    }
    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Answer",
      error: error,
    });
  }
};

const deleteAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM UserAnswer WHERE answer_id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Answer ID",
      });
    }
    const data = await conn.query(
      "DELETE FROM UserAnswer WHERE answer_id = ?",
      [id]
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Answer",
      });
    }
    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Answer",
      error: error,
    });
  }
};

module.exports = {
  getAllAnswers,
  getAnswersById,
  insertAnswers,
  updateAnswers,
  deleteAnswers,
};
