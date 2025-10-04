const conn = require("../config/db");
// Get all users
const getAllLessons = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Lessons");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Lesson found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Lesson retrieved successfully",
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
const getLessonById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Lessons WHERE id = ?", [id]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Lesson found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lesson fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Lesson by ID",
      error: error,
    });
  }
};

//Insert Question
const insertLesson = async (req, res) => {
  try {
    const { course_id, title, content, video_url, attachments } = req.body;
    if (!course_id || !title || !content || !video_url || !attachments) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Lessons(course_id, title, content, video_url, attachments ) VALUES ( ?, ?, ?, ?, ? )",
      [course_id, title, content, video_url, attachments]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Lesson",
      });
    }
    res.status(201).json({
      success: true,
      message: "Lesson inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Lesson",
      error: error,
    });
  }
};
//Update Question
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Lessons WHERE id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Lesson ID",
      });
    }
    const { course_id, title, content, video_url, attachments } = req.body;
    const data = await conn.query(
      "UPDATE Lessons SET course_id=?, title = ?, content = ?, video_url = ?, attachments = ?  WHERE id = ?",
      [course_id, title, content, video_url, attachments, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Lesson",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Lesson",
      error: error,
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query("SELECT * FROM Lessons WHERE id = ?", [
      id,
    ]);
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Lesson ID",
      });
    }
    const data = await conn.query("DELETE FROM Lessons WHERE id = ?", [id]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Lesson",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Lesson",
      error: error,
    });
  }
};
module.exports = {
  getAllLessons,
  getLessonById,
  insertLesson,
  updateLesson,
  deleteLesson
};
