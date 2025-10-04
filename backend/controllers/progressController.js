const conn = require("../config/db");
// Get all users
const getAllProgress = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Progress");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Progress found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Progress retrieved successfully",
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
const getProgressById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Progress  WHERE id = ?", [id]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Progress found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Progress fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Progress by ID",
      error: error,
    });
  }
};

//Insert Question
const insertProgress = async (req, res) => {
  try {
    const { student_id, course_id, completed_lessons, percentage_completed} =
      req.body;
    if (!student_id || !course_id || !completed_lessons || !percentage_completed) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Progress(student_id, course_id, completed_lessons, percentage_completed) VALUES ( ?, ?, ?, ?)",
      [student_id, course_id, completed_lessons, percentage_completed]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Progress",
      });
    }
    res.status(201).json({
      success: true,
      message: "Progress inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Progress",
      error: error,
    });
  }
};
//Update Question
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Progress WHERE id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Progress ID",
      });
    }
        const { student_id, course_id, completed_lessons, percentage_completed} = req.body;
    const data = await conn.query(
      "UPDATE Progress SET student_id = ?, course_id=?, completed_lessons = ?, percentage_completed = ?, updated_at = NOW() WHERE id = ?",
      [student_id, course_id, completed_lessons, percentage_completed, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Progress",
      });
    }
    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Progress",
      error: error,
    });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Progress WHERE id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Progress ID",
      });
    }
    const data = await conn.query("DELETE FROM Progress WHERE id = ?", [id]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Progress",
      });
    }
    res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Progress",
      error: error,
    });
  }
};
module.exports = {
  getAllProgress,
  getProgressById,
  insertProgress,
  updateProgress,
  deleteProgress,
};
